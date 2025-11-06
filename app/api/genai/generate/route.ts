import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import mime from "mime";
import { cleanMarkdownContent, buildSystemPrompt } from "@/lib/paper-prompts";
import { getGenAIClients, GEMINI_MODEL_NAME } from "@/lib/server/genai";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const paperNameValue = formData.get("paperName");
    const paperPatternValue = formData.get("paperPattern");
    const durationValue = formData.get("duration");
    const totalMarksValue = formData.get("totalMarks");

    const paperName = typeof paperNameValue === "string" ? paperNameValue.trim() : "";
    const paperPattern =
      typeof paperPatternValue === "string" ? paperPatternValue.trim() : "";
    const duration = typeof durationValue === "string" ? durationValue.trim() : "";
    const totalMarks =
      typeof totalMarksValue === "string" ? totalMarksValue.trim() : "";

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

    const { modelClient, fileManager } = getGenAIClients();
    const model = modelClient.getGenerativeModel({ model: GEMINI_MODEL_NAME });

    const uploadedFiles: Array<{
      name: string;
      uri: string;
      mimeType?: string;
    }> = [];

    try {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType =
          file.type || mime.getType(file.name) || "application/octet-stream";

        const uploadResult = await fileManager.uploadFile(buffer, {
          mimeType,
          displayName: file.name,
        });

        const uploadedFile = uploadResult.file;
        if (!uploadedFile || !uploadedFile.uri) {
          throw new Error("Unable to upload file to Google GenAI.");
        }

        const uploadedName = uploadedFile.name ?? uploadedFile.uri;
        if (!uploadedName) {
          throw new Error("Uploaded file is missing a reference name.");
        }

        uploadedFiles.push({
          name: uploadedName,
          uri: uploadedFile.uri,
          mimeType: uploadedFile.mimeType ?? mimeType,
        });
      }

      const systemPrompt = buildSystemPrompt(
        paperName,
        paperPattern,
        duration,
        totalMarks,
      );

      const fileParts = uploadedFiles.map((fileMetadata) => ({
        fileData: {
          fileUri: fileMetadata.uri,
          mimeType: fileMetadata.mimeType || "application/octet-stream",
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
    } finally {
      await Promise.all(
        uploadedFiles.map((file) =>
          fileManager.deleteFile(file.name).catch(() => undefined),
        ),
      );
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
