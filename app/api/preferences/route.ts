import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    "/api/preferences",
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: authResult.userId },
    });

    return NextResponse.json({
      preferences: preferences || { theme: "DARK", viewMode: "CARD" },
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch preferences");
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    "/api/preferences",
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { theme, viewMode } = await request.json();

    const preferences = await prisma.userPreference.upsert({
      where: { userId: authResult.userId },
      update: {
        ...(theme && { theme }),
        ...(viewMode && { viewMode }),
        updatedAt: new Date(),
      },
      create: {
        userId: authResult.userId,
        theme: theme || "DARK",
        viewMode: viewMode || "CARD",
      },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return createErrorResponse(error, "Failed to update preferences");
  }
}
