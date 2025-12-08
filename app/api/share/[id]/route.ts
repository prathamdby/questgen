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
    const shareLink = await prisma.shareLink.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found" },
        { status: 404 },
      );
    }

    if (shareLink.userId !== authResult.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.shareLink.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error, "Failed to revoke share link");
  }
}
