import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/api-middleware";

const VALID_ACTIONS = ["export"] as const;
type TrackAction = (typeof VALID_ACTIONS)[number];

function isValidAction(action: unknown): action is TrackAction {
  return typeof action === "string" && VALID_ACTIONS.includes(action as TrackAction);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  try {
    const { id } = await params;
    const { action } = await request.json();

    if (!isValidAction(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(", ")}` },
        { status: 400 },
      );
    }

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
