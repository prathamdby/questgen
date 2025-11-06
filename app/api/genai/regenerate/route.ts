import { NextResponse } from "next/server";
import { cleanMarkdownContent, buildSystemPrompt } from "@/lib/paper-prompts";
import { getGenAIClient, GEMINI_MODEL_NAME } from "@/lib/server/genai";

interface RegenerateRequestBody {
  paperName?: string;
  paperPattern?: string;
  duration?: string;
  totalMarks?: string;
  previousContent?: string;
  instructions?: string;
}

function safeTrim(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

async function extractResponseText(result: unknown): Promise<string | undefined> {
  const responseLike = (result as { response?: unknown })?.response;

  if (responseLike) {
    const textCandidate = (responseLike as { text?: unknown }).text;

    if (typeof textCandidate === "string") {
      return textCandidate.trim();
    }

    if (typeof textCandidate === "function") {
      const value = textCandidate();
      return typeof value === "string" ? value.trim() : (await value)?.trim();
    }
  }

  const directText = (result as { text?: unknown }).text;

  if (typeof directText === "string") {
    return directText.trim();
  }

  if (typeof directText === "function") {
    const value = directText();
    return typeof value === "string" ? value.trim() : (await value)?.trim();
  }

  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegenerateRequestBody;

    const paperName = safeTrim(body.paperName ?? null);
    const paperPattern = safeTrim(body.paperPattern ?? null);
    const duration = safeTrim(body.duration ?? null);
    const totalMarks = safeTrim(body.totalMarks ?? null);
    const previousContent = safeTrim(body.previousContent ?? null);
    const instructions = safeTrim(body.instructions ?? null);

    if (!paperName || !paperPattern || !duration || !totalMarks) {
      return NextResponse.json(
        { error: "Paper name, pattern, duration, and total marks are required." },
        { status: 400 },
      );
    }

    if (!previousContent) {
      return NextResponse.json(
        { error: "Previous paper content is required for regeneration." },
        { status: 400 },
      );
    }

    const genAI = getGenAIClient();

    const systemPrompt = buildSystemPrompt(
      paperName,
      paperPattern,
      duration,
      totalMarks,
    );

    const instructionSummary = instructions
      ? `Apply the following regeneration instructions while keeping the existing structure and metadata intact:\n${instructions}`
      : "No additional user instructions were provided. Refresh the paper while preserving the structure, tone, and difficulty implied by the metadata.";

    const userParts = [
      {
        text: [
          "Regenerate the question paper using the specifications above.",
          "Maintain the same section structure, formatting, and metadata.",
          instructionSummary,
          "Use the previous paper version below purely as context. Produce a refreshed paper that fully complies with the authoritative metadata and marks budget.",
        ].join("\n\n"),
      },
      {
        text: `Previous paper content:\n${previousContent}`,
      },
    ];

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }],
        },
      },
      contents: [
        {
          role: "user",
          parts: userParts,
        },
      ],
    });

    const text = await extractResponseText(result);

    if (!text) {
      return NextResponse.json(
        { error: "The AI response did not include any content." },
        { status: 502 },
      );
    }

    const cleanedContent = cleanMarkdownContent(text);

    return NextResponse.json({ content: cleanedContent });
  } catch (error) {
    console.error("GenAI regeneration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while regenerating the paper.",
      },
      { status: 500 },
    );
  }
}
