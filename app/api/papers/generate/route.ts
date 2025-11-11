import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ai, DEFAULT_MODEL, DEFAULT_GENERATION_CONFIG } from "@/lib/ai";
import { buildSystemPrompt, buildSolutionSystemPrompt } from "@/lib/ai-prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { createPartFromUri, type Part } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

function cleanMarkdownContent(content: string): string {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/i, "");
  cleaned = cleaned.replace(/\n```\s*$/i, "");
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const rateLimitResult = await checkRateLimit(
    request,
    session.user.id,
    "/api/papers/generate",
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-Retry-After": rateLimitResult.retryAfter?.toString() || "60",
        },
      },
    );
  }

  let paperId: string | null = null;
  const uploadedFileUris: Array<{ uri: string; mimeType: string }> = [];

  try {
    const {
      paperName,
      paperPattern,
      duration,
      totalMarks,
      files,
      generateSolution,
    } = await request.json();

    const shouldGenerateSolution = Boolean(generateSolution);

    const paper = await prisma.paper.create({
      data: {
        userId: session.user.id,
        title: paperName,
        pattern: paperPattern,
        duration,
        totalMarks: parseInt(totalMarks),
        content: "",
        status: "IN_PROGRESS",
        files: {
          create: files.map(
            (f: { name: string; size: number; type: string }) => ({
              name: f.name,
              size: f.size,
              mimeType: f.type,
            }),
          ),
        },
      },
      include: { files: true },
    });

    paperId = paper.id;

    const uploadResults = await Promise.allSettled(
      files.map(
        async (fileData: {
          name: string;
          size: number;
          type: string;
          data: string;
        }) => {
          const blob = new Blob([Buffer.from(fileData.data, "base64")], {
            type: fileData.type,
          });
          const uploaded = await ai.files.upload({
            file: blob,
            config: {
              mimeType: fileData.type,
              displayName: fileData.name,
            },
          });

          let fileStatus = await ai.files.get({ name: uploaded.name! });
          while (fileStatus.state === "PROCESSING") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            fileStatus = await ai.files.get({ name: uploaded.name! });
          }

          if (fileStatus.state === "FAILED") {
            throw new Error(`File processing failed: ${fileData.name}`);
          }

          return {
            uri: uploaded.uri!,
            mimeType: uploaded.mimeType!,
          };
        },
      ),
    );

    const failures = uploadResults.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      const failureMessages = failures
        .map((r) => (r.status === "rejected" ? r.reason?.message : null))
        .filter(Boolean)
        .join(", ");

      const successfulUploads = uploadResults
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean) as Array<{ uri: string; mimeType: string }>;

      await Promise.all(
        successfulUploads.map((file) => {
          const fileName = file.uri.split("/").pop()!;
          return ai.files.delete({ name: fileName }).catch(() => {});
        }),
      );

      await prisma.paper.delete({ where: { id: paperId } }).catch(() => {});

      throw new Error(
        `${failures.length} file(s) failed to upload: ${failureMessages}`,
      );
    }

    uploadedFileUris.push(
      ...(uploadResults
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean) as Array<{ uri: string; mimeType: string }>),
    );

    const contents: Part[] = [
      {
        text: buildSystemPrompt(paperName, paperPattern, duration, totalMarks),
      },
      {
        text: "Based on the following materials, generate the question paper:",
      },
    ];

    for (const file of uploadedFileUris) {
      contents.push(createPartFromUri(file.uri, file.mimeType));
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      config: DEFAULT_GENERATION_CONFIG,
      contents,
    });

    const generatedContent = cleanMarkdownContent(response.text || "");

    const updatedPaper = await prisma.paper.update({
      where: { id: paper.id },
      data: {
        content: generatedContent,
        status: "COMPLETED",
      },
    });

    let solutionId: string | null = null;
    let solutionError: string | null = null;

    if (shouldGenerateSolution) {
      try {
        const solutionContents: Part[] = [
          {
            text: buildSolutionSystemPrompt(paperName, generatedContent),
          },
          {
            text: "Based on the question paper above and the following source materials, generate comprehensive solutions:",
          },
        ];

        for (const file of uploadedFileUris) {
          solutionContents.push(createPartFromUri(file.uri, file.mimeType));
        }

        const solutionResponse = await ai.models.generateContent({
          model: DEFAULT_MODEL,
          config: DEFAULT_GENERATION_CONFIG,
          contents: solutionContents,
        });

        const generatedSolutionContent = cleanMarkdownContent(
          solutionResponse.text || "",
        );

        const solution = await prisma.solution.upsert({
          where: { paperId: paper.id },
          update: {
            content: generatedSolutionContent,
            status: "COMPLETED",
          },
          create: {
            paperId: paper.id,
            userId: session.user.id,
            content: generatedSolutionContent,
            status: "COMPLETED",
          },
        });

        solutionId = solution.id;
      } catch (err) {
        console.error("Solution generation error:", err);
        solutionError =
          err instanceof Error ? err.message : "Solution generation failed";
      }
    }

    await Promise.all(
      uploadedFileUris.map((file) => {
        const fileName = file.uri.split("/").pop()!;
        return ai.files.delete({ name: fileName }).catch(() => {});
      }),
    );

    return NextResponse.json({
      success: true,
      paperId: updatedPaper.id,
      content: updatedPaper.content,
      solutionId,
      solutionError,
    });
  } catch (error) {
    if (paperId) {
      await prisma.paper.delete({ where: { id: paperId } }).catch(() => {});
    }

    await Promise.all(
      uploadedFileUris.map((file) => {
        const fileName = file.uri.split("/").pop()!;
        return ai.files.delete({ name: fileName }).catch(() => {});
      }),
    );

    console.error("Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
