import { NextResponse } from "next/server";
import mime from "mime";
import { cleanMarkdownContent, buildSystemPrompt } from "@/lib/paper-prompts";
import { getGenAIClient, GEMINI_MODEL_NAME } from "@/lib/server/genai";

type UploadedFileResource = {
  name: string;
  uri: string;
  mimeType: string;
};

function readFormValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
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
    const formData = await request.formData();

    const paperName = readFormValue(formData.get("paperName"));
    const paperPattern = readFormValue(formData.get("paperPattern"));
    const duration = readFormValue(formData.get("duration"));
    const totalMarks = readFormValue(formData.get("totalMarks"));

    if (!paperName || !paperPattern || !duration || !totalMarks) {
      return NextResponse.json(
        { error: "Paper name, pattern, duration, and total marks are required." },
        { status: 400 },
      );
    }

    const rawFiles = formData.getAll("files");
    const files = rawFiles.filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one source file must be provided." },
        { status: 400 },
      );
    }

    const genAI = getGenAIClient();

    const uploadedFiles: UploadedFileResource[] = [];

    try {
      for (const file of files) {
        const fallbackMime =
          file.type || mime.getType(file.name) || "application/octet-stream";

        const uploaded = await genAI.files.upload({
          file,
          config: {
            mimeType: fallbackMime,
            displayName: file.name,
          },
        });

        const name = uploaded?.name ?? uploaded?.uri;
        const uri = uploaded?.uri ?? uploaded?.name;

        if (!name || !uri) {
          throw new Error("Uploaded file is missing a reference identifier.");
        }

        uploadedFiles.push({
          name,
          uri,
          mimeType: uploaded?.mimeType ?? fallbackMime,
        });
      }

      const systemPrompt = buildSystemPrompt(
        paperName,
        paperPattern,
        duration,
        totalMarks,
      );

      const fileParts = uploadedFiles.map((fileResource) => ({
        fileData: {
          fileUri: fileResource.uri,
          mimeType: fileResource.mimeType || "application/octet-stream",
        },
      }));

      const userParts = [
        {
          text: [
            "Use the attached source materials to generate the complete question paper.",
            "Ensure the structure, marks distribution, and instructions align perfectly with the specification.",
            "Respond exclusively with the finalized Markdown paper.",
          ].join("\n\n"),
        },
        ...fileParts,
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
    } finally {
      const filesModule = genAI.files as unknown as {
        delete?: (params: { name: string }) => Promise<unknown>;
      };

      const deleteFn = filesModule.delete;
      if (typeof deleteFn === "function") {
        await Promise.all(
          uploadedFiles.map((file) => deleteFn({ name: file.name }).catch(() => undefined)),
        );
      }
    }
  } catch (error) {
    console.error("GenAI generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while generating the paper.",
      },
      { status: 500 },
    );
  }
}
