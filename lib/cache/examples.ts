/**
 * Example usage patterns for the server-side cache module
 *
 * This file demonstrates common patterns and best practices for using the cache
 * in API routes and server-side code. It's meant as documentation and reference.
 */

import { cache, cacheKeys, cacheUtils } from "./index";

/**
 * Example 1: Basic getOrCompute usage
 * Cache a user's paper list with default TTL
 */
export async function getUserPapers(userId: string) {
  const result = await cache.getOrCompute(
    cacheKeys.paper.list(userId),
    async () => {
      // Expensive database operation
      const papers = await fetchPapersFromDatabase(userId);
      return papers;
    },
  );

  // result.value contains the papers (fresh or stale)
  // result.isFresh indicates if data is within stale threshold
  // result.isRefreshing indicates background refresh is happening

  return result.value;
}

/**
 * Example 2: Custom TTL for different data types
 * User preferences change less frequently, so cache longer
 */
export async function getUserPreferences(userId: string) {
  const result = await cache.getOrCompute(
    cacheKeys.user.preferences(userId),
    async () => {
      const preferences = await fetchPreferencesFromDatabase(userId);
      return preferences;
    },
    { ttlMs: 30 * 60 * 1000 }, // 30 minutes
  );

  return result.value;
}

/**
 * Example 3: Using utility helpers for common patterns
 */
export async function getPaperDetail(userId: string, paperId: string) {
  const result = await cacheUtils.cachePaperDetail(
    userId,
    paperId,
    async () => {
      const paper = await fetchPaperFromDatabase(userId, paperId);
      return paper;
    },
  );

  return result.value;
}

/**
 * Example 4: Cache invalidation after mutations
 * Always invalidate relevant cache entries after write operations
 */
export async function updatePaper(
  userId: string,
  paperId: string,
  updates: any,
) {
  // Perform the update in the database
  const updatedPaper = await updatePaperInDatabase(userId, paperId, updates);

  // Invalidate all relevant cache entries
  cacheUtils.invalidatePaperCache(userId, paperId);

  return updatedPaper;
}

/**
 * Example 5: Bulk invalidation for user-wide changes
 */
export async function updateUserPreferences(userId: string, preferences: any) {
  // Update preferences in database
  const updated = await updatePreferencesInDatabase(userId, preferences);

  // Invalidate all user-specific cache entries
  const invalidatedCount = cacheUtils.invalidateUserCache(userId);
  console.log(
    `Invalidated ${invalidatedCount} cache entries for user ${userId}`,
  );

  return updated;
}

/**
 * Example 6: Pattern-based invalidation for complex scenarios
 */
export async function regeneratePaper(userId: string, paperId: string) {
  // Start regeneration process
  const regenerationPromise = triggerRegeneration(userId, paperId);

  // Mark paper as in-progress in cache immediately
  const existingPaper = await fetchPaperFromDatabase(userId, paperId);
  cache.set(cacheKeys.paper.detail(userId, paperId), {
    ...existingPaper,
    status: "in_progress",
  });

  // Wait for regeneration
  const result = await regenerationPromise;

  // Update cache with fresh data
  cache.set(cacheKeys.paper.detail(userId, paperId), result);

  // Invalidate any dependent caches
  cache.delete(cacheKeys.paper.content(userId, paperId));
  cache.invalidateByPattern(`paper:list:${userId}:`);

  return result;
}

/**
 * Example 7: Cache statistics and monitoring
 */
export function getCacheHealth() {
  const stats = cache.getStats();

  return {
    ...stats,
    hitRate: stats.hits / (stats.hits + stats.misses) || 0,
    staleRate: stats.staleHits / (stats.hits + stats.staleHits) || 0,
    isHealthy: stats.size < 800, // Alert if approaching max size
  };
}

/**
 * Example 8: Conditional caching based on data characteristics
 */
export async function getCachedOrFresh<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    // Cache large responses longer, small responses shorter
    useLargeResponseTTL?: boolean;
    // Don't cache if data is very fresh (less than 1 minute old)
    skipIfVeryFresh?: boolean;
  } = {},
) {
  // Check existing cache first
  const existing = cache.get<T>(key);

  if (existing && options.skipIfVeryFresh) {
    const age = Date.now() - (existing as any).createdAt;
    if (age < 60 * 1000) {
      // Less than 1 minute old
      return existing.value;
    }
  }

  // Compute with appropriate TTL
  const ttlMs = options.useLargeResponseTTL
    ? 15 * 60 * 1000 // 15 minutes for large data
    : 5 * 60 * 1000; // 5 minutes for small data

  const result = await cache.getOrCompute(key, fetchFn, { ttlMs });

  return result.value;
}

// Mock database functions for demonstration
async function fetchPapersFromDatabase(userId: string) {
  // Implementation would query the database
  return [];
}

async function fetchPaperFromDatabase(userId: string, paperId: string) {
  // Implementation would query the database
  return { id: paperId, userId, title: "Sample Paper", status: "completed" };
}

async function fetchPreferencesFromDatabase(userId: string) {
  // Implementation would query the database
  return {};
}

async function updatePaperInDatabase(
  userId: string,
  paperId: string,
  updates: any,
) {
  // Implementation would update the database
  return null;
}

async function updatePreferencesInDatabase(userId: string, preferences: any) {
  // Implementation would update the database
  return null;
}

async function triggerRegeneration(userId: string, paperId: string) {
  // Implementation would trigger AI regeneration
  return null;
}
