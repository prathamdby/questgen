import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      preferences: preferences || { theme: "DARK", viewMode: "CARD" },
    });
  } catch (error) {
    console.error("Failed to fetch preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch preferences",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { theme, viewMode } = await request.json();

    const preferences = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: {
        ...(theme && { theme }),
        ...(viewMode && { viewMode }),
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        theme: theme || "DARK",
        viewMode: viewMode || "CARD",
      },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Failed to update preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to update preferences",
      },
      { status: 500 },
    );
  }
}
