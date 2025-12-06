import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { deleteGeminiFiles } from "@/lib/ai-utils";

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { fileUris } = await request.json();

    if (!fileUris || !Array.isArray(fileUris)) {
      return NextResponse.json(
        { error: "fileUris array is required" },
        { status: 400 },
      );
    }

    await deleteGeminiFiles(fileUris);

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
