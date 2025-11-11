/**
 * Cache configuration constants and environment variable mappings
 * Centralizes all cache-related settings for easy maintenance
 */

/**
 * Default cache TTL in milliseconds (5 minutes)
 * Can be overridden via CACHE_TTL_MS environment variable
 */
export const DEFAULT_CACHE_TTL_MS =
  Number(process.env.CACHE_TTL_MS) || 5 * 60 * 1000;

/**
 * Default stale-while-revalidate threshold in milliseconds (2 minutes)
 * Can be overridden via CACHE_STALE_THRESHOLD_MS environment variable
 * When data is older than this but younger than TTL, it's served stale while refresh happens in background
 */
export const DEFAULT_CACHE_STALE_THRESHOLD_MS =
  Number(process.env.CACHE_STALE_THRESHOLD_MS) || 2 * 60 * 1000;

/**
 * Maximum number of entries to store in cache
 * Can be overridden via CACHE_MAX_SIZE environment variable
 * Helps prevent memory leaks in long-running processes
 */
export const DEFAULT_CACHE_MAX_SIZE =
  Number(process.env.CACHE_MAX_SIZE) || 1000;

/**
 * Cache configuration interface for type safety
 */
export interface CacheConfig {
  /** Time-to-live in milliseconds */
  ttlMs: number;
  /** Stale-while-revalidate threshold in milliseconds */
  staleThresholdMs: number;
  /** Maximum number of cache entries */
  maxSize: number;
}

/**
 * Default cache configuration
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttlMs: DEFAULT_CACHE_TTL_MS,
  staleThresholdMs: DEFAULT_CACHE_STALE_THRESHOLD_MS,
  maxSize: DEFAULT_CACHE_MAX_SIZE,
};

/**
 * Cache entry metadata
 */
export interface CacheEntry<T> {
  /** The cached value */
  value: T;
  /** Timestamp when the entry was created (Unix timestamp in ms) */
  createdAt: number;
  /** Timestamp when the entry was last accessed (Unix timestamp in ms) */
  lastAccessedAt: number;
  /** Whether this entry is currently being refreshed */
  isRefreshing?: boolean;
}

/**
 * Cache statistics for monitoring
 */
export interface CacheStats {
  /** Total number of entries in cache */
  size: number;
  /** Number of entries currently being refreshed */
  refreshingCount: number;
  /** Number of cache hits since last stats reset */
  hits: number;
  /** Number of cache misses since last stats reset */
  misses: number;
  /** Number of stale hits served since last stats reset */
  staleHits: number;
}
