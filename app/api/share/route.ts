import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

const DEFAULT_EXPIRATION_DAYS = 30;
const MIN_EXPIRATION_DAYS = 1;
const MAX_EXPIRATION_DAYS = 365;

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.SHARE,
  );
  if (!rateLimitResult.success) return rateLimitResult.response;

  try {
    const { paperId, solutionId, expiresInDays } = await request.json();

    const hasPaper = typeof paperId === "string" && paperId.length > 0;
    const hasSolution = typeof solutionId === "string" && solutionId.length > 0;
    if (hasPaper === hasSolution) {
      return NextResponse.json(
        { error: "Exactly one of paperId or solutionId required" },
        { status: 400 },
      );
    }

    if (hasPaper) {
      const paper = await prisma.paper.findFirst({
        where: { id: paperId, userId: authResult.userId },
      });
      if (!paper) {
        return NextResponse.json({ error: "Paper not found" }, { status: 404 });
      }
    } else {
      const solution = await prisma.solution.findFirst({
        where: { id: solutionId, userId: authResult.userId },
      });
      if (!solution) {
        return NextResponse.json(
          { error: "Solution not found" },
          { status: 404 },
        );
      }
    }

    const token = randomBytes(32).toString("base64url");

    const days =
      typeof expiresInDays === "number"
        ? Math.max(
            MIN_EXPIRATION_DAYS,
            Math.min(MAX_EXPIRATION_DAYS, expiresInDays),
          )
        : DEFAULT_EXPIRATION_DAYS;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const shareLink = await prisma.shareLink.create({
      data: {
        token,
        userId: authResult.userId,
        paperId: hasPaper ? paperId : null,
        solutionId: hasSolution ? solutionId : null,
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      shareLink: {
        id: shareLink.id,
        token: shareLink.token,
        url: `${appUrl}/shared/${shareLink.token}`,
        paperId: shareLink.paperId,
        solutionId: shareLink.solutionId,
        expiresAt: shareLink.expiresAt?.toISOString() || null,
      },
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to create share link");
  }
}

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.SHARE,
  );
  if (!rateLimitResult.success) return rateLimitResult.response;

  try {
    const shareLinks = await prisma.shareLink.findMany({
      where: { userId: authResult.userId },
      include: {
        paper: { select: { id: true, title: true } },
        solution: { select: { id: true, paper: { select: { title: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      shareLinks: shareLinks.map((link) => ({
        id: link.id,
        token: link.token,
        url: `${appUrl}/shared/${link.token}`,
        paperId: link.paperId,
        solutionId: link.solutionId,
        title: link.paper?.title || link.solution?.paper?.title || "Untitled",
        type: link.paperId ? "paper" : "solution",
        expiresAt: link.expiresAt?.toISOString() || null,
        createdAt: link.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch share links");
  }
}
