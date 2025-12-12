import { prisma } from "@/lib/prisma";
import {
  API_KEYS,
  createGeminiContext,
  type GeminiContext,
} from "@/lib/ai";
import { generateWithRetry } from "@/lib/ai-retry";
import {
  buildSystemPrompt,
  buildPastPapersSystemPrompt,
  buildSolutionSystemPrompt,
} from "@/lib/ai-prompts";
import { pastPaperStrategies } from "@/lib/past-paper-strategies";
import { createPartFromUri, type Part } from "@google/genai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { cleanMarkdownContent } from "@/lib/transformers";
import { deleteGeminiFiles, parseGeminiError } from "@/lib/ai-utils";
import { withAuth, withRateLimit } from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

type IncomingFilePayload = {
  uri: string;
  mimeType: string;
  name: string;
  size: number;
  role: "source" | "past_paper";
  keyIndex?: number;
};

function validateFileKeyIndices(
  files: IncomingFilePayload[],
): { valid: true; keyIndex: number | undefined } | { valid: false; error: string } {
  if (files.length === 0) {
    return { valid: true, keyIndex: undefined };
  }

  const keyIndices = files
    .map((f) => f.keyIndex)
    .filter((idx): idx is number => idx !== undefined);

  if (keyIndices.length === 0) {
    return { valid: true, keyIndex: undefined };
  }

  const firstKeyIndex = keyIndices[0];

  if (!keyIndices.every((idx) => idx === firstKeyIndex)) {
    return {
      valid: false,
      error: "All uploaded files must use the same API key context",
    };
  }

  if (firstKeyIndex < 0 || firstKeyIndex >= API_KEYS.length) {
    return {
      valid: false,
      error: "Invalid API key context for uploaded files",
    };
  }

  return { valid: true, keyIndex: firstKeyIndex };
}

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PAPERS_GENERATE,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  let paperId: string | null = null;
  let ctx: GeminiContext = createGeminiContext();
  const uploadedFileUris: Array<{
    uri: string;
    mimeType: string;
    role: "source" | "past_paper";
  }> = [];

  try {
    const {
      paperName,
      paperPattern,
      duration,
      totalMarks,
      generationMode,
      strategy,
      fileUris,
      generateSolution,
    } = await request.json();

    const allFiles: IncomingFilePayload[] = (fileUris ||
      []) as IncomingFilePayload[];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one file is required" },
        { status: 400 },
      );
    }

    const keyValidation = validateFileKeyIndices(allFiles);
    if (!keyValidation.valid) {
      return NextResponse.json(
        { success: false, error: keyValidation.error },
        { status: 400 },
      );
    }

    if (keyValidation.keyIndex !== undefined) {
      ctx = {
        client: new GoogleGenAI({ apiKey: API_KEYS[keyValidation.keyIndex] }),
        keyIndex: keyValidation.keyIndex,
      };
    } else {
      ctx = createGeminiContext();
    }

    const shouldGenerateSolution = Boolean(generateSolution);
    const mode =
      generationMode === "past_papers" ? "PAST_PAPERS" : "FROM_SCRATCH";
    const selectedStrategy =
      mode === "PAST_PAPERS"
        ? (pastPaperStrategies.find((item) => item.id === strategy) ??
          pastPaperStrategies[0])
        : null;

    const paper = await prisma.paper.create({
      data: {
        userId: authResult.userId,
        title: paperName,
        pattern: paperPattern,
        duration,
        totalMarks: parseInt(totalMarks),
        content: "",
        status: "IN_PROGRESS",
        generationMode: mode,
        strategy:
          mode === "PAST_PAPERS" ? (selectedStrategy?.id ?? null) : null,
        files: {
          create: allFiles.map((f) => ({
            name: f.name,
            size: f.size,
            mimeType: f.mimeType,
            role: f.role === "past_paper" ? "PAST_PAPER" : "SOURCE",
          })),
        },
      },
      include: { files: true },
    });

    paperId = paper.id;

    uploadedFileUris.push(
      ...allFiles.map((f) => ({
        uri: f.uri,
        mimeType: f.mimeType,
        role: f.role,
      })),
    );

    const pastPaperUris = uploadedFileUris.filter(
      (f) => f.role === "past_paper",
    );
    const sourceUris = uploadedFileUris.filter((f) => f.role === "source");

    const systemPromptText =
      mode === "PAST_PAPERS" && selectedStrategy
        ? buildPastPapersSystemPrompt(
            paperName,
            paperPattern,
            duration,
            totalMarks,
            selectedStrategy.promptDirective,
          )
        : buildSystemPrompt(paperName, paperPattern, duration, totalMarks);

    const contents: Part[] = [{ text: systemPromptText }];

    if (mode === "PAST_PAPERS" && pastPaperUris.length > 0) {
      contents.push({
        text: "First, analyze the following past examination papers to identify patterns, common question formats, topic distributions, and difficulty levels:",
      });
      for (const file of pastPaperUris) {
        contents.push(createPartFromUri(file.uri, file.mimeType));
      }
    }

    if (sourceUris.length > 0) {
      contents.push({
        text:
          mode === "PAST_PAPERS"
            ? "Now, use the following source materials as content for generating NEW questions that follow the patterns identified above:"
            : "Based on the following materials, generate the question paper:",
      });
      for (const file of sourceUris) {
        contents.push(createPartFromUri(file.uri, file.mimeType));
      }
    } else if (mode === "PAST_PAPERS") {
      contents.push({
        text: "Generate the new question paper based on the patterns identified in the past papers above, maintaining similar structure and difficulty while creating fresh questions.",
      });
    }

    const response = await generateWithRetry(ctx, (model, config) =>
      ctx.client.models.generateContent({
        model,
        config,
        contents,
      }),
    );

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
        const solutionIntroText =
          mode === "PAST_PAPERS"
            ? "Based on the question paper above, the source materials provided, and insights gleaned from the analyzed past papers (use them only to ensure alignment, never to copy answers), generate comprehensive solutions:"
            : "Based on the question paper above and the following source materials, generate comprehensive solutions:";

        const solutionContents: Part[] = [
          {
            text: buildSolutionSystemPrompt(paperName, generatedContent),
          },
          {
            text: solutionIntroText,
          },
        ];

        if (sourceUris.length > 0) {
          for (const file of sourceUris) {
            solutionContents.push(createPartFromUri(file.uri, file.mimeType));
          }
        }

        if (mode === "PAST_PAPERS" && pastPaperUris.length > 0) {
          solutionContents.push({
            text: "Past papers (for pattern reference only, do not replicate their content verbatim in solutions):",
          });
          for (const file of pastPaperUris) {
            solutionContents.push(createPartFromUri(file.uri, file.mimeType));
          }
        }

        if (sourceUris.length === 0 && pastPaperUris.length === 0) {
          for (const file of uploadedFileUris) {
            solutionContents.push(createPartFromUri(file.uri, file.mimeType));
          }
        }

        const solutionResponse = await generateWithRetry(ctx, (model, config) =>
          ctx.client.models.generateContent({
            model,
            config,
            contents: solutionContents,
          }),
        );

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
            userId: authResult.userId,
            content: generatedSolutionContent,
            status: "COMPLETED",
          },
        });

        solutionId = solution.id;
      } catch (err) {
        console.error("Solution generation error:", err);
        solutionError = parseGeminiError(err);
      }
    }

    await deleteGeminiFiles(ctx.client, uploadedFileUris);

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

    await deleteGeminiFiles(ctx.client, uploadedFileUris);

    console.error("Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: parseGeminiError(error),
      },
      { status: 500 },
    );
  }
}
