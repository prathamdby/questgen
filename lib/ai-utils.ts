import { ai } from "@/lib/ai";

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
