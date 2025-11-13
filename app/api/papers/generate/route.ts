import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ai, DEFAULT_MODEL, DEFAULT_GENERATION_CONFIG } from "@/lib/ai";
import {
  buildSystemPrompt,
  buildPastPapersSystemPrompt,
  buildSolutionSystemPrompt,
} from "@/lib/ai-prompts";
import { pastPaperStrategies } from "@/lib/past-paper-strategies";
import { checkRateLimit } from "@/lib/rate-limit";
import { createPartFromUri, type Part } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

type IncomingFilePayload = {
  name: string;
  size: number;
  type: string;
  data: string;
  role: "source" | "past_paper";
};

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
      sourceFiles,
      pastPaperFiles,
      generateSolution,
    } = await request.json();

    const shouldGenerateSolution = Boolean(generateSolution);
    const mode =
      generationMode === "past_papers" ? "PAST_PAPERS" : "FROM_SCRATCH";
    const selectedStrategy =
      mode === "PAST_PAPERS"
        ? (pastPaperStrategies.find((item) => item.id === strategy) ??
          pastPaperStrategies[0])
        : null;

    const sourceFilePayloads = (sourceFiles || []) as IncomingFilePayload[];
    const pastPaperFilePayloads = (pastPaperFiles ||
      []) as IncomingFilePayload[];
    const allFiles: IncomingFilePayload[] = [
      ...sourceFilePayloads,
      ...pastPaperFilePayloads,
    ];

    if (allFiles.length === 0) {
      throw new Error("At least one file is required");
    }

    const paper = await prisma.paper.create({
      data: {
        userId: session.user.id,
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
          create: allFiles.map(
            (f: {
              name: string;
              size: number;
              type: string;
              role: "source" | "past_paper";
            }) => ({
              name: f.name,
              size: f.size,
              mimeType: f.type,
              role: f.role === "past_paper" ? "PAST_PAPER" : "SOURCE",
            }),
          ),
        },
      },
      include: { files: true },
    });

    paperId = paper.id;

    const uploadResults = await Promise.allSettled(
      allFiles.map(async (fileData: IncomingFilePayload) => {
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
          role: fileData.role,
        };
      }),
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
        .filter(Boolean) as Array<{
        uri: string;
        mimeType: string;
        role: "source" | "past_paper";
      }>;

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
        .filter(Boolean) as Array<{
        uri: string;
        mimeType: string;
        role: "source" | "past_paper";
      }>),
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
