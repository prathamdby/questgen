import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.SHARE_ID,
  );
  if (!rateLimitResult.success) return rateLimitResult.response;

  try {
    const result = await prisma.shareLink.deleteMany({
      where: { id, userId: authResult.userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Share link not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error, "Failed to revoke share link");
  }
}
