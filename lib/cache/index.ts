/**
 * Public API for the server-side cache module
 *
 * This module provides a comprehensive in-memory caching solution with:
 * - TTL-based expiration with configurable thresholds
 * - Stale-while-revalidate behavior for improved performance
 * - Request deduplication to prevent thundering herd
 * - Strongly-typed cache keys for consistency
 * - Singleton pattern safe for Next.js development
 *
 * Example usage:
 *
 * ```typescript
 * import { cache, cacheKeys } from '@/lib/cache';
 *
 * // Get or compute a user's paper list
 * const result = await cache.getOrCompute(
 *   cacheKeys.paper.list(userId),
 *   () => fetchUserPapers(userId),
 *   { ttlMs: 10 * 60 * 1000 } // Optional: 10 minutes
 * );
 *
 * if (result.isFresh) {
 *   console.log('Fresh data');
 * } else {
 *   console.log('Stale data (refreshing in background)');
 * }
 *
 * // Invalidate all paper cache for a user
 * cache.invalidateByPattern(`paper:list:${userId}:`);
 * ```
 */

// Core cache implementation
export { cache, InMemoryCache } from "./in-memory-cache";
export type {
  CacheResult,
  CacheConfig,
  CacheEntry,
  CacheStats,
} from "./in-memory-cache";

// Configuration and constants
export {
  DEFAULT_CACHE_TTL_MS,
  DEFAULT_CACHE_STALE_THRESHOLD_MS,
  DEFAULT_CACHE_MAX_SIZE,
  DEFAULT_CACHE_CONFIG,
} from "./config";
export type { CacheConfig as ConfigType } from "./config";

// Strongly-typed cache keys
export { cacheKeys, cacheKeyUtils, CACHE_NAMESPACES } from "./keys";
export type { CacheKeyPattern } from "./keys";

// Import the necessary modules for utility functions
import { cache } from "./in-memory-cache";
import { cacheKeys, cacheKeyUtils } from "./keys";

/**
 * Utility functions for common cache operations
 */
export const cacheUtils = {
  /**
   * Cache a paper list with standard TTL
   */
  cachePaperList: async <T>(
    userId: string,
    fetchFn: () => Promise<T>,
    options?: { ttlMs?: number },
  ) => {
    return cache.getOrCompute(cacheKeys.paper.list(userId), fetchFn, options);
  },

  /**
   * Cache a paper detail with standard TTL
   */
  cachePaperDetail: async <T>(
    userId: string,
    paperId: string,
    fetchFn: () => Promise<T>,
    options?: { ttlMs?: number },
  ) => {
    return cache.getOrCompute(
      cacheKeys.paper.detail(userId, paperId),
      fetchFn,
      options,
    );
  },

  /**
   * Cache a solution detail with standard TTL
   */
  cacheSolutionDetail: async <T>(
    userId: string,
    solutionId: string,
    fetchFn: () => Promise<T>,
    options?: { ttlMs?: number },
  ) => {
    return cache.getOrCompute(
      cacheKeys.solution.detail(userId, solutionId),
      fetchFn,
      options,
    );
  },

  /**
   * Invalidate all cache entries for a specific user
   */
  invalidateUserCache: (userId: string): number => {
    const patterns = [
      cacheKeyUtils.createPattern("paper", `list:${userId}:`),
      cacheKeyUtils.createPattern("paper", `detail:${userId}:`),
      cacheKeyUtils.createPattern("solution", `detail:${userId}:`),
      cacheKeyUtils.createPattern("user", `${userId}:`),
      cacheKeyUtils.createPattern("preferences", `view:${userId}`),
    ];

    return patterns.reduce((total, pattern) => {
      return total + cache.invalidateByPattern(pattern);
    }, 0);
  },

  /**
   * Invalidate cache entries for a specific paper and its solution
   */
  invalidatePaperCache: (userId: string, paperId: string): number => {
    const patterns = [
      cacheKeyUtils.createPattern("paper", `list:${userId}:`),
      cacheKeys.paper.detail(userId, paperId),
      cacheKeys.paper.content(userId, paperId),
      cacheKeys.paper.files(userId, paperId),
      cacheKeys.paper.tags(userId, paperId),
      cacheKeys.solution.byPaper(userId, paperId),
    ];

    return patterns.reduce((total, pattern) => {
      if (pattern.includes(":")) {
        // Exact key match
        return total + (cache.delete(pattern) ? 1 : 0);
      } else {
        // Pattern match
        return total + cache.invalidateByPattern(pattern);
      }
    }, 0);
  },

  /**
   * Invalidate cache entries for a specific solution
   */
  invalidateSolutionCache: (
    userId: string,
    solutionId: string,
    paperId?: string,
  ): number => {
    const patterns = [
      cacheKeys.solution.detail(userId, solutionId),
      cacheKeys.solution.content(userId, solutionId),
    ];

    // Also invalidate by paper if provided (one-to-one relationship)
    if (paperId) {
      patterns.push(cacheKeys.solution.byPaper(userId, paperId));
    }

    return patterns.reduce((total, key) => {
      return total + (cache.delete(key) ? 1 : 0);
    }, 0);
  },
} as const;
