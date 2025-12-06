import { ai } from "@/lib/ai";

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
