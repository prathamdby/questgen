import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

function transformStatus(dbStatus: string): "completed" | "in_progress" {
  return dbStatus === "COMPLETED" ? "completed" : "in_progress";
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const rateLimitResult = await checkRateLimit(
    request,
    session.user.id,
    "/api/papers",
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-Retry-After": rateLimitResult.retryAfter?.toString() || "60",
        },
      },
    );
  }

  try {
    const url = request.nextUrl;
    const limitParam = url.searchParams.get("limit");
    const cursor = url.searchParams.get("cursor") || undefined;

    const shouldPaginate = Boolean(limitParam || cursor);
    const limitValue = limitParam
      ? parseInt(limitParam, 10)
      : cursor
        ? 50
        : undefined;
    const effectiveLimit = limitValue
      ? Math.min(Math.max(limitValue, 1), 100)
      : undefined;
    const paginationArgs = effectiveLimit
      ? {
          take: effectiveLimit + 1,
          ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        }
      : {};

    const [papersResult, solutionsResult] = await Promise.allSettled([
      prisma.paper.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          title: true,
          pattern: true,
          duration: true,
          totalMarks: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          files: {
            select: {
              id: true,
              name: true,
              size: true,
              mimeType: true,
              createdAt: true,
            },
          },
          tags: {
            select: {
              id: true,
              tag: true,
            },
          },
          solution: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        ...paginationArgs,
      }),
      prisma.solution.findMany({
        where: { userId: session.user.id },
        include: {
          paper: {
            select: {
              id: true,
              title: true,
              pattern: true,
              duration: true,
              totalMarks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const papers =
      papersResult.status === "fulfilled" ? papersResult.value : [];
    const solutions =
      solutionsResult.status === "fulfilled" ? solutionsResult.value : [];

    let hasMore = false;
    let nextCursor = null;
    let finalPapers = papers;

    if (effectiveLimit !== undefined) {
      hasMore = papers.length > effectiveLimit;
      finalPapers = hasMore ? papers.slice(0, -1) : papers;
      nextCursor =
        hasMore && finalPapers.length > 0
          ? finalPapers[finalPapers.length - 1].id
          : null;
    }

    const transformedPapers = finalPapers.map((paper) => ({
      ...paper,
      status: transformStatus(paper.status),
    }));

    const transformedSolutions = solutions.map((solution) => ({
      ...solution,
      status: transformStatus(solution.status),
    }));

    const response: {
      papers: typeof transformedPapers;
      solutions: typeof transformedSolutions;
      pagination?: {
        hasMore: boolean;
        nextCursor: string | null;
        limit: number;
      };
    } = {
      papers: transformedPapers,
      solutions: transformedSolutions,
    };

    if (shouldPaginate && effectiveLimit !== undefined) {
      response.pagination = {
        hasMore,
        nextCursor,
        limit: effectiveLimit,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch papers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch papers",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const rateLimitResult = await checkRateLimit(
    request,
    session.user.id,
    "/api/papers",
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-Retry-After": rateLimitResult.retryAfter?.toString() || "60",
        },
      },
    );
  }

  try {
    const { title, pattern, duration, totalMarks, content, solution } =
      await request.json();

    const paper = await prisma.paper.create({
      data: {
        userId: session.user.id,
        title,
        pattern,
        duration,
        totalMarks: parseInt(totalMarks),
        content,
        status: "COMPLETED",
      },
    });

    let createdSolutionId: string | null = null;

    if (solution && typeof solution.content === "string") {
      const createdSolution = await prisma.solution.create({
        data: {
          userId: session.user.id,
          paperId: paper.id,
          content: solution.content,
          status:
            solution.status === "in_progress" ? "IN_PROGRESS" : "COMPLETED",
        },
      });

      createdSolutionId = createdSolution.id;
    }

    return NextResponse.json({
      paperId: paper.id,
      solutionId: createdSolutionId,
    });
  } catch (error) {
    console.error("Create paper error:", error);
    return NextResponse.json(
      {
        error: "Failed to create paper",
      },
      { status: 500 },
    );
  }
}
