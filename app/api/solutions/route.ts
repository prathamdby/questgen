import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuthAndRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const authResult = await withAuthAndRateLimit(
    request,
    RATE_LIMIT_ENDPOINTS.SOLUTIONS,
  );
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { paperId, content } = await request.json();

    if (!paperId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper || paper.userId !== authResult.userId) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    const existingSolution = await prisma.solution.findUnique({
      where: { paperId },
    });

    if (existingSolution) {
      return NextResponse.json(
        { error: "Solution already exists for this paper" },
        { status: 409 },
      );
    }

    const solution = await prisma.solution.create({
      data: {
        userId: authResult.userId,
        paperId,
        content,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ solutionId: solution.id });
  } catch (error) {
    return createErrorResponse(error, "Failed to create solution");
  }
}
