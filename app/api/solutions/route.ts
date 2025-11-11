import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    if (!paper || paper.userId !== session.user.id) {
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
        userId: session.user.id,
        paperId,
        content,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ solutionId: solution.id });
  } catch (error) {
    console.error("Create solution error:", error);
    return NextResponse.json(
      {
        error: "Failed to create solution",
      },
      { status: 500 },
    );
  }
}
