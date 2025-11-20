export function transformStatus(dbStatus: string): "completed" | "in_progress" {
  return dbStatus === "COMPLETED" ? "completed" : "in_progress";
}

export function cleanMarkdownContent(content: string): string {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*\n/i, "");
  cleaned = cleaned.replace(/\n```\s*$/i, "");
  return cleaned.trim();
}
