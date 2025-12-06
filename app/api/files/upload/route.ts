import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { uploadFileToGemini } from "@/lib/ai-utils";

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const role = formData.get("role") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!role || (role !== "source" && role !== "past_paper")) {
      return NextResponse.json(
        { error: "Valid role (source or past_paper) is required" },
        { status: 400 },
      );
    }

    const result = await uploadFileToGemini(file, file.name, file.type);

    return NextResponse.json({
      success: true,
      uri: result.uri,
      mimeType: result.mimeType,
      name: file.name,
      size: file.size,
      role,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "File upload failed",
      },
      { status: 500 },
    );
  }
}
