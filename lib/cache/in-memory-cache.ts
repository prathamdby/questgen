/**
 * In-memory cache implementation with TTL, stale-while-revalidate, and deduplication
 *
 * Features:
 * - Configurable TTL and stale thresholds
 * - Stale-while-revalidate behavior (serves stale data while refreshing)
 * - Request deduplication to prevent thundering herd
 * - Automatic cleanup of expired entries
 * - Singleton pattern for Next.js hot reload safety
 * - Comprehensive statistics and monitoring
 */

import {
  CacheConfig,
  CacheEntry,
  CacheStats,
  DEFAULT_CACHE_CONFIG,
} from "./config";

/**
 * Cache result with metadata about freshness and refresh status
 */
export interface CacheResult<T> {
  /** The cached value (fresh or stale) */
  value: T;
  /** Whether the value is fresh (within stale threshold) */
  isFresh: boolean;
  /** Whether a background refresh is in progress */
  isRefreshing: boolean;
}

/**
 * In-flight request tracking for deduplication
 */
interface InFlightRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

/**
 * In-memory cache implementation
 */
class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private inFlight = new Map<string, InFlightRequest<any>>();
  private config: CacheConfig;
  private stats: CacheStats = {
    size: 0,
    refreshingCount: 0,
    hits: 0,
    misses: 0,
    staleHits: 0,
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };

    // Set up periodic cleanup (every minute)
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  /**
   * Get a value from cache or compute it using the provided function
   * Implements stale-while-revalidate pattern with request deduplication
   */
  async getOrCompute<T>(
    key: string,
    computeFn: () => Promise<T>,
    options: {
      ttlMs?: number;
      staleThresholdMs?: number;
    } = {},
  ): Promise<CacheResult<T>> {
    const now = Date.now();
    const ttlMs = options.ttlMs ?? this.config.ttlMs;
    const staleThresholdMs =
      options.staleThresholdMs ?? this.config.staleThresholdMs;

    // Check if we have an in-flight request for this key
    const existingInFlight = this.inFlight.get(key);
    if (existingInFlight) {
      const value = await existingInFlight.promise;
      return {
        value,
        isFresh: true,
        isRefreshing: true,
      };
    }

    // Check cache for existing entry
    const existing = this.cache.get(key);
    if (existing) {
      const age = now - existing.createdAt;
      const isStale = age > staleThresholdMs;
      const isExpired = age > ttlMs;

      // Update last accessed time
      existing.lastAccessedAt = now;

      if (!isStale) {
        // Fresh hit
        this.stats.hits++;
        return {
          value: existing.value,
          isFresh: true,
          isRefreshing: false,
        };
      }

      if (!isExpired) {
        // Stale hit - serve stale data while refreshing
        this.stats.staleHits++;
        this.triggerBackgroundRefresh(key, computeFn, existing);
        return {
          value: existing.value,
          isFresh: false,
          isRefreshing: true,
        };
      }
    }

    // Cache miss or expired - compute fresh value
    this.stats.misses++;
    return this.computeAndCache(key, computeFn, ttlMs);
  }

  /**
   * Get a value from cache without computing if missing
   */
  get<T>(key: string): CacheResult<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.createdAt;
    const isStale = age > this.config.staleThresholdMs;
    const isExpired = age > this.config.ttlMs;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    // Update last accessed time
    entry.lastAccessedAt = now;

    if (isStale) {
      this.stats.staleHits++;
    } else {
      this.stats.hits++;
    }

    return {
      value: entry.value,
      isFresh: !isStale,
      isRefreshing: entry.isRefreshing ?? false,
    };
  }

  /**
   * Set a value in cache with optional TTL override
   */
  set<T>(
    key: string,
    value: T,
    options: {
      ttlMs?: number;
    } = {},
  ): void {
    this.ensureCapacity();

    const entry: CacheEntry<T> = {
      value,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      isRefreshing: false,
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    // Clean up any in-flight requests
    this.inFlight.delete(key);
    const deleted = this.cache.delete(key);
    this.updateStats();
    return deleted;
  }

  /**
   * Invalidate cache entries by key pattern
   */
  invalidateByPattern(pattern: string | RegExp): number {
    let deleted = 0;
    const keys = Array.from(this.cache.keys());

    for (const key of keys) {
      let shouldDelete = false;

      if (typeof pattern === "string") {
        shouldDelete = key.startsWith(pattern);
      } else {
        shouldDelete = pattern.test(key);
      }

      if (shouldDelete) {
        this.cache.delete(key);
        this.inFlight.delete(key);
        deleted++;
      }
    }

    this.updateStats();
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.inFlight.clear();
    this.updateStats();
  }

  /**
   * Get current cache statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Reset statistics counters
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.staleHits = 0;
    this.updateStats();
  }

  /**
   * Compute and cache a value
   */
  private async computeAndCache<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttlMs: number,
  ): Promise<CacheResult<T>> {
    // Set up in-flight tracking
    const promise = computeFn();
    this.inFlight.set(key, {
      promise,
      timestamp: Date.now(),
    });

    try {
      const value = await promise;

      // Cache the computed value
      this.set(key, value, { ttlMs });

      return {
        value,
        isFresh: true,
        isRefreshing: false,
      };
    } finally {
      // Clean up in-flight tracking
      this.inFlight.delete(key);
      this.updateStats();
    }
  }

  /**
   * Trigger background refresh for stale entries
   */
  private async triggerBackgroundRefresh<T>(
    key: string,
    computeFn: () => Promise<T>,
    entry: CacheEntry<T>,
  ): Promise<void> {
    // Prevent multiple refreshes for the same key
    if (entry.isRefreshing) return;

    entry.isRefreshing = true;
    this.updateStats();

    try {
      const promise = computeFn();
      this.inFlight.set(key, {
        promise,
        timestamp: Date.now(),
      });

      const value = await promise;

      // Update the cached value
      entry.value = value;
      entry.createdAt = Date.now();
      entry.isRefreshing = false;
    } catch (error) {
      // On error, mark as not refreshing but keep existing stale value
      entry.isRefreshing = false;
      console.error(`Cache refresh failed for key ${key}:`, error);
    } finally {
      this.inFlight.delete(key);
      this.updateStats();
    }
  }

  /**
   * Clean up expired entries and stale in-flight requests
   */
  private cleanup(): void {
    const now = Date.now();
    let deleted = 0;

    // Clean up expired cache entries
    const cacheKeys = Array.from(this.cache.keys());
    for (const key of cacheKeys) {
      const entry = this.cache.get(key);
      if (entry) {
        const age = now - entry.createdAt;
        if (age > this.config.ttlMs) {
          this.cache.delete(key);
          deleted++;
        }
      }
    }

    // Clean up stale in-flight requests (older than 5 minutes)
    const inFlightKeys = Array.from(this.inFlight.keys());
    for (const key of inFlightKeys) {
      const request = this.inFlight.get(key);
      if (request) {
        const age = now - request.timestamp;
        if (age > 5 * 60 * 1000) {
          this.inFlight.delete(key);
        }
      }
    }

    if (deleted > 0) {
      this.updateStats();
    }
  }

  /**
   * Ensure cache doesn't exceed maximum capacity
   */
  private ensureCapacity(): void {
    if (this.cache.size < this.config.maxSize) return;

    // Sort by last accessed time (LRU eviction)
    const entries: Array<[string, CacheEntry<any>]> = [];
    this.cache.forEach((value, key) => {
      entries.push([key, value]);
    });
    entries.sort((a, b) => a[1].lastAccessedAt - b[1].lastAccessedAt);

    // Evict oldest entries
    const toEvict = entries.slice(0, this.cache.size - this.config.maxSize + 1);
    for (const [key] of toEvict) {
      this.cache.delete(key);
      this.inFlight.delete(key);
    }
  }

  /**
   * Update internal statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.refreshingCount = Array.from(this.cache.values()).filter(
      (entry) => entry.isRefreshing,
    ).length;
  }
}

/**
 * Global cache instance using the same pattern as lib/prisma.ts
 * Ensures singleton behavior across Next.js hot reloads in development
 */
const globalForCache = globalThis as unknown as {
  cache: InMemoryCache | undefined;
};

/**
 * Export singleton cache instance
 */
export const cache = globalForCache.cache ?? new InMemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.cache = cache;
}

/**
 * Export the cache class for testing or custom instances
 */
export { InMemoryCache };

/**
 * Export types for external use
 * Note: We rename CacheEntry to avoid conflicts with DOM Cache interface
 */
export type { CacheConfig, CacheEntry, CacheStats };
