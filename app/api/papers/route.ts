import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  try {
    const papers = await prisma.paper.findMany({
      where: { userId: session.user.id },
      include: {
        files: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const transformedPapers = papers.map(
      (paper: typeof papers[number]) => ({
        ...paper,
        status: transformStatus(paper.status),
      }),
    );

    return NextResponse.json({ papers: transformedPapers });
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

  try {
    const { title, pattern, duration, totalMarks, content } =
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

    return NextResponse.json({ paperId: paper.id });
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
