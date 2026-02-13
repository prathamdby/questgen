import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PREFERENCES,
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
    RATE_LIMIT_ENDPOINTS.PREFERENCES,
  );
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const body = await request.json();
    const {
      theme,
      viewMode,
      defaultPattern,
      defaultPatternPresetId,
      defaultDuration,
      defaultTotalMarks,
      defaultGenerationMode,
      defaultStrategy,
      defaultGenerateSolution,
    } = body;

    const VALID_THEMES = ["LIGHT", "DARK", "SYSTEM"];
    const VALID_VIEW_MODES = ["CARD", "LIST"];
    const VALID_GENERATION_MODES = ["FROM_SCRATCH", "PAST_PAPERS"];

    if (theme !== undefined && !VALID_THEMES.includes(theme)) {
      return NextResponse.json(
        { error: `Invalid theme. Must be one of: ${VALID_THEMES.join(", ")}` },
        { status: 400 },
      );
    }
    if (viewMode !== undefined && !VALID_VIEW_MODES.includes(viewMode)) {
      return NextResponse.json(
        { error: `Invalid viewMode. Must be one of: ${VALID_VIEW_MODES.join(", ")}` },
        { status: 400 },
      );
    }
    if (
      defaultGenerationMode !== undefined &&
      defaultGenerationMode !== null &&
      !VALID_GENERATION_MODES.includes(defaultGenerationMode)
    ) {
      return NextResponse.json(
        { error: `Invalid defaultGenerationMode. Must be one of: ${VALID_GENERATION_MODES.join(", ")}` },
        { status: 400 },
      );
    }
    if (
      defaultGenerateSolution !== undefined &&
      typeof defaultGenerateSolution !== "boolean"
    ) {
      return NextResponse.json(
        { error: "defaultGenerateSolution must be a boolean" },
        { status: 400 },
      );
    }

    const preferences = await prisma.userPreference.upsert({
      where: { userId: authResult.userId },
      update: {
        ...(theme !== undefined && { theme }),
        ...(viewMode !== undefined && { viewMode }),
        ...(defaultPattern !== undefined && { defaultPattern }),
        ...(defaultPatternPresetId !== undefined && { defaultPatternPresetId }),
        ...(defaultDuration !== undefined && { defaultDuration }),
        ...(defaultTotalMarks !== undefined && { defaultTotalMarks }),
        ...(defaultGenerationMode !== undefined && { defaultGenerationMode }),
        ...(defaultStrategy !== undefined && { defaultStrategy }),
        ...(defaultGenerateSolution !== undefined && { defaultGenerateSolution }),
      },
      create: {
        userId: authResult.userId,
        theme: theme || "DARK",
        viewMode: viewMode || "CARD",
        defaultPattern: defaultPattern ?? null,
        defaultPatternPresetId: defaultPatternPresetId ?? null,
        defaultDuration: defaultDuration ?? null,
        defaultTotalMarks: defaultTotalMarks ?? null,
        defaultGenerationMode: defaultGenerationMode ?? null,
        defaultStrategy: defaultStrategy ?? null,
        defaultGenerateSolution: defaultGenerateSolution ?? false,
      },
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return createErrorResponse(error, "Failed to update preferences");
  }
}
