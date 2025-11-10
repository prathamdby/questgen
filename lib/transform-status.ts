/**
 * Transform database status enum to client-facing status
 */
export function transformStatus(dbStatus: string): "completed" | "in_progress" {
  return dbStatus === "COMPLETED" ? "completed" : "in_progress";
}
