# Server Cache Module

This module provides a comprehensive in-memory caching solution for QuestGen with TTL-based expiry, stale-while-revalidate behavior, and request deduplication.

## Features

- **TTL-based expiration** with configurable time-to-live
- **Stale-while-revalidate** - serves stale data while refreshing in background
- **Request deduplication** - prevents thundering herd on concurrent requests
- **Strongly-typed cache keys** - avoids ad-hoc strings across the codebase
- **Singleton pattern** - safe for Next.js development hot reloads
- **Comprehensive statistics** - monitor cache performance
- **Pattern-based invalidation** - bulk cache clearing by key patterns

## Quick Start

```typescript
import { cache, cacheKeys, cacheUtils } from "@/lib/cache";

// Cache a user's paper list with automatic TTL
const result = await cache.getOrCompute(
  cacheKeys.paper.list(userId),
  async () => {
    // Expensive database operation
    return await fetchPapersFromDatabase(userId);
  },
);

// result.value contains the papers (fresh or stale)
// result.isFresh indicates if data is within stale threshold
// result.isRefreshing indicates background refresh is happening

// Invalidate cache after mutations
cacheUtils.invalidatePaperCache(userId, paperId);
```

## Configuration

Environment variables (optional, defaults shown):

```bash
# Time-to-live for cache entries in milliseconds (default: 5 minutes)
CACHE_TTL_MS="300000"

# Stale-while-revalidate threshold in milliseconds (default: 2 minutes)
CACHE_STALE_THRESHOLD_MS="120000"

# Maximum number of cache entries to prevent memory leaks (default: 1000)
CACHE_MAX_SIZE="1000"
```

## Cache Keys

Strongly-typed key builders prevent typos and ensure consistency:

```typescript
// Paper-related keys
cacheKeys.paper.list(userId); // "paper:list:user-123"
cacheKeys.paper.detail(userId, paperId); // "paper:detail:user-123:paper-456"
cacheKeys.paper.content(userId, paperId); // "paper:content:user-123:paper-456"

// Solution-related keys
cacheKeys.solution.detail(userId, solutionId); // "solution:detail:user-123:sol-789"
cacheKeys.solution.byPaper(userId, paperId); // "solution:by-paper:user-123:paper-456"

// User-related keys
cacheKeys.user.preferences(userId); // "user:preferences:user-123"
cacheKeys.user.profile(userId); // "user:profile:user-123"
```

## Utility Functions

Helper functions for common patterns:

```typescript
// Cache operations with standard TTL
await cacheUtils.cachePaperList(userId, fetchPapers);
await cacheUtils.cachePaperDetail(userId, paperId, fetchPaper);
await cacheUtils.cacheSolutionDetail(userId, solutionId, fetchSolution);

// Bulk invalidation
cacheUtils.invalidateUserCache(userId); // All user-related cache
cacheUtils.invalidatePaperCache(userId, paperId); // Paper + related solution
cacheUtils.invalidateSolutionCache(userId, solutionId, paperId);
```

## Advanced Usage

### Custom TTL

```typescript
// Cache user preferences longer (30 minutes)
await cache.getOrCompute(cacheKeys.user.preferences(userId), fetchPreferences, {
  ttlMs: 30 * 60 * 1000,
});
```

### Pattern-based Invalidation

```typescript
// Invalidate all paper lists for a user
cache.invalidateByPattern(`paper:list:${userId}:`);

// Invalidate all cache entries for a namespace
cache.invalidateByPattern("paper:"); // All paper-related entries
```

### Cache Statistics

```typescript
const stats = cache.getStats();
console.log({
  size: stats.size, // Total entries
  hits: stats.hits, // Fresh hits
  misses: stats.misses, // Cache misses
  staleHits: stats.staleHits, // Stale hits served
  refreshingCount: stats.refreshingCount, // Background refreshes
  hitRate: stats.hits / (stats.hits + stats.misses),
});
```

## Best Practices

1. **Always invalidate after mutations** - call appropriate cache utils after database writes
2. **Use appropriate TTLs** - cache data that changes frequently for shorter periods
3. **Monitor statistics** - track hit rates to optimize cache strategies
4. **Prefer utility functions** - use cacheUtils helpers for consistency
5. **Test cache behavior** - verify both fresh and stale data scenarios

## File Structure

```
lib/cache/
├── config.ts          # Configuration constants and types
├── keys.ts            # Strongly-typed cache key builders
├── in-memory-cache.ts # Core cache implementation
├── index.ts           # Public API and utilities
└── examples.ts        # Usage examples and patterns
```

## Implementation Notes

- Uses `globalThis` pattern for singleton behavior (like `lib/prisma.ts`)
- Automatic cleanup prevents memory leaks
- Request deduplication prevents thundering herd
- Compatible with both Node.js and Edge runtime environments
- TypeScript strict mode with comprehensive type safety
