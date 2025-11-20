import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { transformStatus } from "@/lib/transformers";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PAPERS_ID,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const paper = await prisma.paper.findFirst({
      where: { id, userId: authResult.userId },
      include: {
        files: true,
        tags: true,
        solution: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    const transformedPaper = {
      ...paper,
      status: transformStatus(paper.status),
    };

    return NextResponse.json({ paper: transformedPaper });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch paper");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PAPERS_ID,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const result = await prisma.paper.deleteMany({
      where: {
        id,
        userId: authResult.userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error, "Failed to delete paper");
  }
}
