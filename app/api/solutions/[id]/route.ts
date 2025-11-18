import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { transformStatus } from "@/lib/transformers";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";

/**
 * GET /api/solutions/[id]
 * Fetch a single solution by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    "/api/solutions/[id]",
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { id } = await params;

    const solution = await prisma.solution.findFirst({
      where: {
        id,
        userId: authResult.userId,
      },
      include: {
        paper: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 },
      );
    }

    const transformedSolution = {
      ...solution,
      status: transformStatus(solution.status),
    };

    return NextResponse.json({ solution: transformedSolution });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch solution");
  }
}

/**
 * DELETE /api/solutions/[id]
 * Delete a solution by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    "/api/solutions/[id]",
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { id } = await params;

    const result = await prisma.solution.deleteMany({
      where: {
        id,
        userId: authResult.userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error, "Failed to delete solution");
  }
}
