import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/api-middleware";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "export") {
      await prisma.paper.updateMany({
        where: { id, userId: authResult.userId },
        data: { exportCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error, "Failed to track action");
  }
}
