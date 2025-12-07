import { ai } from "@/lib/ai";
import { ApiError } from "@google/genai";

const FILE_PROCESSING_TIMEOUT_MS = 60_000;
const FILE_PROCESSING_POLL_INTERVAL_MS = 2_000;

export interface GeminiFileResult {
  uri: string;
  mimeType: string;
  name: string;
}

export async function uploadFileToGemini(
  file: File | Blob,
  displayName: string,
  mimeType: string,
): Promise<GeminiFileResult> {
  const uploaded = await ai.files.upload({
    file,
    config: {
      mimeType,
      displayName,
    },
  });

  const startTime = Date.now();
  let fileStatus = await ai.files.get({ name: uploaded.name! });

  while (fileStatus.state === "PROCESSING") {
    if (Date.now() - startTime > FILE_PROCESSING_TIMEOUT_MS) {
      throw new Error(`File processing timeout (>60s): ${displayName}`);
    }
    await new Promise((resolve) =>
      setTimeout(resolve, FILE_PROCESSING_POLL_INTERVAL_MS),
    );
    fileStatus = await ai.files.get({ name: uploaded.name! });
  }

  if (fileStatus.state === "FAILED") {
    throw new Error(`File processing failed: ${displayName}`);
  }

  return {
    uri: uploaded.uri!,
    mimeType: uploaded.mimeType!,
    name: uploaded.name!,
  };
}

export async function deleteGeminiFiles(
  fileUris: Array<{ uri: string; mimeType: string }>,
): Promise<{ succeeded: number; failed: number }> {
  const results = await Promise.allSettled(
    fileUris.map((file) => {
      const fileName = file.uri.split("/").pop()!;
      return ai.files.delete({ name: fileName });
    }),
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) {
    console.error(
      `[Gemini Cleanup] Failed to delete ${failed}/${fileUris.length} files - potential quota leak`,
    );
  }

  return { succeeded: results.length - failed, failed };
}

function tryParseGeminiJson(
  message: string,
): { code: number; message: string } | null {
  try {
    const json = JSON.parse(message);
    const err = json.error ?? json;
    if (typeof err.code === "number" && typeof err.message === "string") {
      return { code: err.code, message: err.message };
    }
  } catch {
    // Not valid JSON or doesn't match expected structure
  }
  return null;
}

function mapStatusToMessage(code: number, rawMessage: string): string {
  switch (code) {
    case 503:
      return "The AI model is currently overloaded. Please try again in a few moments.";
    case 429:
      return "Too many requests. Please wait before trying again.";
    case 400:
      return `Invalid request: ${rawMessage}`;
    case 401:
      return "Authentication failed. Please sign in again.";
    case 404:
      return "The requested model is not available.";
    default:
      return rawMessage || "An unexpected error occurred";
  }
}

export function parseGeminiError(error: unknown): string {
  if (error instanceof ApiError) {
    return mapStatusToMessage(error.status, error.message);
  }

  if (error instanceof Error) {
    const parsed = tryParseGeminiJson(error.message);
    if (parsed) {
      return mapStatusToMessage(parsed.code, parsed.message);
    }
    return error.message;
  }

  return "An unexpected error occurred";
}
