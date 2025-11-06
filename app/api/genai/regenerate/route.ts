import { NextResponse } from "next/server";
import { cleanMarkdownContent, buildSystemPrompt } from "@/lib/paper-prompts";
import { getGenAIClients, GEMINI_MODEL_NAME } from "@/lib/server/genai";

interface RegenerateRequestBody {
  paperName?: string;
  paperPattern?: string;
  duration?: string;
  totalMarks?: string;
  previousContent?: string;
  instructions?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegenerateRequestBody;

    const paperName = body.paperName?.trim();
    const paperPattern = body.paperPattern?.trim();
    const duration = body.duration?.trim();
    const totalMarks = body.totalMarks?.trim();
    const previousContent = body.previousContent?.trim();
    const instructions = body.instructions?.trim();

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

    const { modelClient } = getGenAIClients();
    const model = modelClient.getGenerativeModel({ model: GEMINI_MODEL_NAME });

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

    const result = await model.generateContent({
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: userParts,
        },
      ],
    });

    const text =
      typeof result?.response?.text === "function"
        ? result.response.text()
        : undefined;

    if (!text || typeof text !== "string") {
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
