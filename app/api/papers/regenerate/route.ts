import { prisma } from "@/lib/prisma";
import { createGeminiContext } from "@/lib/ai";
import { generateWithRetry } from "@/lib/ai-retry";
import { buildSystemPrompt, buildSolutionSystemPrompt } from "@/lib/ai-prompts";
import { NextRequest, NextResponse } from "next/server";
import { cleanMarkdownContent } from "@/lib/transformers";
import { parseGeminiError } from "@/lib/ai-utils";
import { withAuth, withRateLimit } from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PAPERS_REGENERATE,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const ctx = createGeminiContext();

    const { paperId, instructions } = await request.json();

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: { solution: true },
    });

    if (!paper || paper.userId !== authResult.userId) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    await prisma.paper.update({
      where: { id: paperId },
      data: { status: "IN_PROGRESS" },
    });

    if (paper.solution) {
      await prisma.solution.update({
        where: { id: paper.solution.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    const systemPrompt = buildSystemPrompt(
      paper.title,
      paper.pattern,
      paper.duration,
      paper.totalMarks.toString(),
    );

    const normalizedInstructions = instructions?.trim();
    const userMessage = normalizedInstructions
      ? `Apply the following regeneration instructions while keeping the existing structure and metadata intact:\n${normalizedInstructions}\n\nPrevious paper content:\n${paper.content}`
      : `Regenerate the question paper using the specifications above.\nMaintain the same section structure, formatting, and metadata.\nNo additional user instructions were provided. Refresh the paper while preserving the structure, tone, and difficulty implied by the metadata.\nPrevious paper content:\n${paper.content}`;

    const [paperResult, solutionResult] = await Promise.allSettled([
      generateWithRetry(ctx, (model, config) =>
        ctx.client.models.generateContent({
          model,
          config,
          contents: [{ text: systemPrompt }, { text: userMessage }],
        }),
      ),
      paper.solution
        ? generateWithRetry(ctx, (model, config) =>
            ctx.client.models.generateContent({
              model,
              config,
              contents: [
                {
                  text: buildSolutionSystemPrompt(paper.title, paper.content),
                },
                {
                  text: normalizedInstructions
                    ? `Regenerate solutions incorporating these changes:\n${normalizedInstructions}\n\nPrevious paper content:\n${paper.content}`
                    : `Regenerate solutions based on the updated paper.`,
                },
              ],
            }),
          )
        : Promise.resolve(null),
    ]);

    const paperContent =
      paperResult.status === "fulfilled"
        ? cleanMarkdownContent(paperResult.value.text || "")
        : null;

    if (!paperContent) {
      throw new Error("Paper regeneration failed");
    }

    let solutionContent: string | null = null;
    let solutionError: string | null = null;

    if (
      paper.solution &&
      solutionResult.status === "fulfilled" &&
      solutionResult.value
    ) {
      solutionContent = cleanMarkdownContent(solutionResult.value.text || "");
    } else if (paper.solution && solutionResult.status === "rejected") {
      solutionError = parseGeminiError(
        solutionResult.reason || new Error("Solution regeneration failed"),
      );
    }

    const results = await prisma.$transaction([
      prisma.paper.update({
        where: { id: paperId },
        data: { content: paperContent, status: "COMPLETED" },
      }),
      ...(paper.solution && solutionContent
        ? [
            prisma.solution.update({
              where: { id: paper.solution.id },
              data: { content: solutionContent, status: "COMPLETED" },
            }),
          ]
        : []),
    ]);
    const updatedPaper = results[0];
    const updatedSolution = results[1] || null;

    return NextResponse.json({
      success: true,
      content: updatedPaper.content,
      updatedAt: updatedPaper.updatedAt,
      solutionId: updatedSolution?.id,
      solutionContent: updatedSolution?.content,
      solutionUpdatedAt: updatedSolution?.updatedAt,
      solutionError: paper.solution && !solutionContent ? solutionError : null,
    });
  } catch (error) {
    console.error("Regeneration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: parseGeminiError(error),
      },
      { status: 500 },
    );
  }
}
