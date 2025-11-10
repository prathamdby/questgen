import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transformStatus } from "@/lib/transform-status";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

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

  try {
    const paper = await prisma.paper.findUnique({
      where: { id },
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

    if (!paper || paper.userId !== session.user.id) {
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

  try {
    const paper = await prisma.paper.findUnique({
      where: { id },
    });

    if (!paper || paper.userId !== session.user.id) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    await prisma.paper.delete({
      where: { id },
    });

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
