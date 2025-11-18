import { ai } from "@/lib/ai";

export async function deleteGeminiFiles(
  fileUris: Array<{ uri: string; mimeType: string }>,
): Promise<void> {
  await Promise.all(
    fileUris.map((file) => {
      const fileName = file.uri.split("/").pop()!;
      return ai.files.delete({ name: fileName }).catch(() => {});
    }),
  );
}
