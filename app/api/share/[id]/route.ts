import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuthAndRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authResult = await withAuthAndRateLimit(
    request,
    RATE_LIMIT_ENDPOINTS.SHARE_ID,
  );
  if (!authResult.success) return authResult.response;

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
