import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const RATE_LIMIT_CONFIG = {
  "/api/papers/generate": { window: 60, max: 2 },
  "/api/papers/regenerate": { window: 60, max: 2 },
  default: { window: 60, max: 100 },
} as const;

const DISABLE_RATE_LIMITING = process.env.DISABLE_RATE_LIMITING === "true";

interface CacheEntry {
  count: number;
  resetAt: number;
  lastUpdated: number;
}

const rateLimitCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60000;

setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitCache.entries()) {
      if (entry.resetAt < now || now - entry.lastUpdated > CACHE_TTL * 2) {
        rateLimitCache.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return userId;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (ip && /^[\d.]+$/.test(ip)) return ip;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "anonymous";
}

async function updateDatabaseAsync(
  key: string,
  count: number,
  resetAt: number
) {
  try {
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count,
        lastRequest: Math.floor(Date.now() / 1000),
      },
    });
  } catch (error) {
    console.error("Background rate limit update failed:", error);
  }
}

export async function checkRateLimit(
  request: NextRequest,
  userId: string | undefined,
  routePath: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (DISABLE_RATE_LIMITING) {
    return { allowed: true };
  }

  const identifier = getClientIdentifier(request, userId);
  const key = `${identifier}:${routePath}`;
  const config =
    RATE_LIMIT_CONFIG[routePath as keyof typeof RATE_LIMIT_CONFIG] ||
    RATE_LIMIT_CONFIG.default;

  try {
    const cached = rateLimitCache.get(key);
    if (cached && cached.resetAt > Date.now()) {
      if (cached.count >= config.max) {
        const retryAfter = Math.ceil((cached.resetAt - Date.now()) / 1000);
        console.log(
          `[Rate Limit] ${routePath} - Rate limit exceeded. ${cached.count}/${config.max} requests used. Retry after ${retryAfter}s`
        );
        return { allowed: false, retryAfter };
      }
      cached.count++;
      cached.lastUpdated = Date.now();
      rateLimitCache.set(key, cached);

      const remaining = config.max - cached.count;
      console.log(
        `[Rate Limit] ${routePath} - ${cached.count}/${config.max} requests used. ${remaining} remaining.`
      );

      updateDatabaseAsync(key, cached.count, cached.resetAt);

      return { allowed: true };
    }

    const now = new Date();
    const resetAt = new Date(now.getTime() + config.window * 1000);

    const updated = await prisma.$executeRaw`
      UPDATE "RateLimit"
      SET count = count + 1,
          "lastRequest" = ${Math.floor(now.getTime() / 1000)}
      WHERE key = ${key}
        AND count < ${config.max}
        AND "resetAt" > ${now}
    `;

    if (updated > 0) {
      const record = await prisma.rateLimit.findUnique({ where: { key } });
      if (record) {
        rateLimitCache.set(key, {
          count: record.count,
          resetAt: record.resetAt.getTime(),
          lastUpdated: Date.now(),
        });
        const remaining = config.max - record.count;
        console.log(
          `[Rate Limit] ${routePath} - ${record.count}/${config.max} requests used. ${remaining} remaining.`
        );
      }
      return { allowed: true };
    }

    const existing = await prisma.rateLimit.findUnique({ where: { key } });

    if (!existing || existing.resetAt < now) {
      const newRecord = await prisma.rateLimit.upsert({
        where: { key },
        update: {
          count: 1,
          resetAt,
          lastRequest: Math.floor(now.getTime() / 1000),
        },
        create: {
          key,
          count: 1,
          resetAt,
          lastRequest: Math.floor(now.getTime() / 1000),
        },
      });

      rateLimitCache.set(key, {
        count: 1,
        resetAt: newRecord.resetAt.getTime(),
        lastUpdated: Date.now(),
      });

      const remaining = config.max - 1;
      console.log(
        `[Rate Limit] ${routePath} - Window reset. 1/${config.max} requests used. ${remaining} remaining.`
      );

      return { allowed: true };
    }

    const retryAfter = Math.ceil(
      (existing.resetAt.getTime() - now.getTime()) / 1000
    );
    rateLimitCache.set(key, {
      count: existing.count,
      resetAt: existing.resetAt.getTime(),
      lastUpdated: Date.now(),
    });

    console.log(
      `[Rate Limit] ${routePath} - Rate limit exceeded. ${existing.count}/${config.max} requests used. Retry after ${retryAfter}s`
    );

    return { allowed: false, retryAfter };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true };
  }
}

export async function cleanupExpiredRateLimits() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await prisma.rateLimit.deleteMany({
    where: {
      resetAt: {
        lt: sevenDaysAgo,
      },
    },
  });
}
