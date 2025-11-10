import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  invalidatePaperCache,
  invalidateSolutionCache,
} from "@/lib/cached-queries";
import { transformStatus } from "@/lib/transform-status";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * GET /api/solutions/[id]
 * Fetch a single solution by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const solution = await prisma.solution.findUnique({
      where: {
        id,
      },
      include: {
        paper: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!solution || solution.userId !== session.user.id) {
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
    console.error("Failed to fetch solution:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch solution",
      },
      { status: 500 },
    );
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const solution = await prisma.solution.findUnique({
      where: { id },
    });

    if (!solution || solution.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 },
      );
    }

    await prisma.solution.delete({
      where: {
        id,
      },
    });

    await invalidateSolutionCache(id, session.user.id);
    await invalidatePaperCache(solution.paperId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete solution:", error);
    return NextResponse.json(
      {
        error: "Failed to delete solution",
      },
      { status: 500 },
    );
  }
}
