import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  serializePaperListItem,
  serializePaper,
  serializeSolution,
} from "@/lib/serialize-paper";
import type {
  PaperListItem,
  TransformedPaper,
  TransformedSolution,
} from "@/lib/types";

/**
 * Base query function for papers list (excludes content for performance)
 * Wrapped in cache() for request deduplication within same render
 */
const getPapersQuery = cache(async (userId: string) => {
  return prisma.paper.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      pattern: true,
      duration: true,
      totalMarks: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      files: {
        select: {
          id: true,
          name: true,
          size: true,
          mimeType: true,
          createdAt: true,
        },
      },
      solution: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});

/**
 * Cached papers list query (cross-request caching)
 * Returns papers without content field for performance
 * Cache TTL: 5 seconds
 */
export const getCachedPapers = cache(
  async (userId: string): Promise<PaperListItem[]> => {
    const cachedFn = unstable_cache(
      async () => {
        try {
          const papers = await getPapersQuery(userId);
          return papers.map(serializePaperListItem);
        } catch (error) {
          console.error("Failed to fetch papers:", error);
          throw error;
        }
      },
      [`papers-${userId}`],
      {
        revalidate: 5,
        tags: [`papers-${userId}`],
      },
    );

    return cachedFn();
  },
);

/**
 * Base query function for single paper (includes content)
 * Wrapped in cache() for request deduplication within same render
 */
const getPaperQuery = cache(async (id: string) => {
  return prisma.paper.findUnique({
    where: { id },
    include: {
      files: true,
      solution: {
        select: {
          id: true,
        },
      },
    },
  });
});

/**
 * Cached single paper query (cross-request caching)
 * Returns paper with full content
 * Cache TTL: 10 seconds
 */
export const getCachedPaper = cache(
  async (id: string, userId: string): Promise<TransformedPaper | null> => {
    const cachedFn = unstable_cache(
      async () => {
        try {
          const paper = await getPaperQuery(id);

          if (!paper || paper.userId !== userId) {
            return null;
          }

          return serializePaper(paper);
        } catch (error) {
          console.error("Failed to fetch paper:", error);
          throw error;
        }
      },
      [`paper-${id}`],
      {
        revalidate: 10,
        tags: [`paper-${id}`, `papers-${userId}`],
      },
    );

    return cachedFn();
  },
);

/**
 * Base query function for single solution
 * Wrapped in cache() for request deduplication within same render
 */
const getSolutionQuery = cache(async (id: string) => {
  return prisma.solution.findUnique({
    where: { id },
    include: {
      paper: {
        include: {
          files: true,
        },
      },
    },
  });
});

/**
 * Cached single solution query (cross-request caching)
 * Cache TTL: 10 seconds
 */
export const getCachedSolution = cache(
  async (id: string, userId: string): Promise<TransformedSolution | null> => {
    const cachedFn = unstable_cache(
      async () => {
        try {
          const solution = await getSolutionQuery(id);

          if (!solution || solution.userId !== userId) {
            return null;
          }

          return serializeSolution(solution);
        } catch (error) {
          console.error("Failed to fetch solution:", error);
          throw error;
        }
      },
      [`solution-${id}`],
      {
        revalidate: 10,
        tags: [`solution-${id}`, `papers-${userId}`],
      },
    );

    return cachedFn();
  },
);

/**
 * Invalidate paper-related caches
 * Call after mutations (create, update, delete, regenerate)
 */
export function invalidatePaperCache(paperId: string, userId: string): void {
  revalidateTag(`paper-${paperId}`, "default");
  revalidateTag(`papers-${userId}`, "default");
}

/**
 * Invalidate solution-related caches
 * Call after mutations (create, delete)
 */
export function invalidateSolutionCache(
  solutionId: string,
  userId: string,
): void {
  revalidateTag(`solution-${solutionId}`, "default");
  revalidateTag(`papers-${userId}`, "default");
}
