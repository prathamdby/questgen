import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

function transformStatus(dbStatus: string): "completed" | "in_progress" {
  return dbStatus === "COMPLETED" ? "completed" : "in_progress";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    "/api/papers/[id]",
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
    const paper = await prisma.paper.findFirst({
      where: { id, userId: session.user.id },
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
    console.error("Failed to fetch paper:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch paper",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    "/api/papers/[id]",
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
    const result = await prisma.paper.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete paper:", error);
    return NextResponse.json(
      {
        error: "Failed to delete paper",
      },
      { status: 500 },
    );
  }
}
