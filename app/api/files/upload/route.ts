import { NextRequest, NextResponse } from "next/server";
import { withAuth, withRateLimit } from "@/lib/api-middleware";
import { uploadFileToGemini, parseGeminiError } from "@/lib/ai-utils";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";
import {
  isSupportedMimeType,
  getMimeTypeFromExtension,
} from "@/lib/file-types";
import { createGeminiContext } from "@/lib/ai";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - matches frontend

function isValidFileType(file: File): boolean {
  if (isSupportedMimeType(file.type)) {
    return true;
  }
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension) {
    const inferredMime = getMimeTypeFromExtension(extension);
    return inferredMime ? isSupportedMimeType(inferredMime) : false;
  }
  return false;
}

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.FILES_UPLOAD,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const ctx = createGeminiContext();

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
        },
        { status: 400 },
      );
    }
    if (!isValidFileType(file)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 400 },
      );
    }

    const result = await uploadFileToGemini(
      ctx.client,
      file,
      file.name,
      file.type,
    );

    return NextResponse.json({
      success: true,
      uri: result.uri,
      mimeType: result.mimeType,
      name: file.name,
      size: file.size,
      role,
      keyIndex: ctx.keyIndex,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: parseGeminiError(error),
      },
      { status: 500 },
    );
  }
}
