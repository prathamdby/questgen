import { NextRequest, NextResponse } from "next/server";
import { withAuth, withRateLimit } from "@/lib/api-middleware";
import { deleteGeminiFiles } from "@/lib/ai-utils";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";
import { ai } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.FILES_CLEANUP,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { fileUris } = await request.json();

    if (!fileUris || !Array.isArray(fileUris)) {
      return NextResponse.json(
        { error: "fileUris array is required" },
        { status: 400 },
      );
    }

    await deleteGeminiFiles(ai, fileUris);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("File cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 },
    );
  }
}
