/**
 * Strongly-typed cache key builders to avoid ad-hoc strings across the codebase
 * Provides a centralized way to manage cache key patterns and ensure consistency
 */

/**
 * Cache key namespace constants
 * These prefixes help organize cache entries and enable bulk invalidation
 */
export const CACHE_NAMESPACES = {
  PAPER: "paper",
  SOLUTION: "solution",
  USER: "user",
  PREFERENCES: "preferences",
} as const;

/**
 * Cache key builders for different entity types
 * Each builder returns a consistent, namespaced key format
 */
export const cacheKeys = {
  /**
   * Paper-related cache keys
   */
  paper: {
    /** List of papers for a user: `paper:list:{userId}` */
    list: (userId: string): string =>
      `${CACHE_NAMESPACES.PAPER}:list:${userId}`,

    /** Individual paper details: `paper:detail:{userId}:{paperId}` */
    detail: (userId: string, paperId: string): string =>
      `${CACHE_NAMESPACES.PAPER}:detail:${userId}:${paperId}`,

    /** Paper content: `paper:content:{userId}:{paperId}` */
    content: (userId: string, paperId: string): string =>
      `${CACHE_NAMESPACES.PAPER}:content:${userId}:${paperId}`,

    /** Paper files: `paper:files:{userId}:{paperId}` */
    files: (userId: string, paperId: string): string =>
      `${CACHE_NAMESPACES.PAPER}:files:${userId}:${paperId}`,

    /** Paper tags: `paper:tags:{userId}:{paperId}` */
    tags: (userId: string, paperId: string): string =>
      `${CACHE_NAMESPACES.PAPER}:tags:${userId}:${paperId}`,
  },

  /**
   * Solution-related cache keys
   */
  solution: {
    /** Individual solution details: `solution:detail:{userId}:{solutionId}` */
    detail: (userId: string, solutionId: string): string =>
      `${CACHE_NAMESPACES.SOLUTION}:detail:${userId}:${solutionId}`,

    /** Solution content: `solution:content:{userId}:{solutionId}` */
    content: (userId: string, solutionId: string): string =>
      `${CACHE_NAMESPACES.SOLUTION}:content:${userId}:${solutionId}`,

    /** Solution by paper ID (one-to-one relationship): `solution:by-paper:{userId}:{paperId}` */
    byPaper: (userId: string, paperId: string): string =>
      `${CACHE_NAMESPACES.SOLUTION}:by-paper:${userId}:${paperId}`,
  },

  /**
   * User-related cache keys
   */
  user: {
    /** User profile: `user:profile:{userId}` */
    profile: (userId: string): string =>
      `${CACHE_NAMESPACES.USER}:profile:${userId}`,

    /** User preferences: `user:preferences:{userId}` */
    preferences: (userId: string): string =>
      `${CACHE_NAMESPACES.USER}:preferences:${userId}`,

    /** User session data: `user:session:{userId}` */
    session: (userId: string): string =>
      `${CACHE_NAMESPACES.USER}:session:${userId}`,
  },

  /**
   * Preference-related cache keys
   */
  preferences: {
    /** User view preferences: `preferences:view:{userId}` */
    view: (userId: string): string =>
      `${CACHE_NAMESPACES.PREFERENCES}:view:${userId}`,

    /** User form drafts: `preferences:draft:{userId}:{formType}` */
    draft: (userId: string, formType: string): string =>
      `${CACHE_NAMESPACES.PREFERENCES}:draft:${userId}:${formType}`,
  },
} as const;

/**
 * Type-safe cache key patterns for validation and testing
 */
export type CacheKeyPattern =
  | `${typeof CACHE_NAMESPACES.PAPER}:${string}`
  | `${typeof CACHE_NAMESPACES.SOLUTION}:${string}`
  | `${typeof CACHE_NAMESPACES.USER}:${string}`
  | `${typeof CACHE_NAMESPACES.PREFERENCES}:${string}`;

/**
 * Utility functions for cache key manipulation
 */
export const cacheKeyUtils = {
  /**
   * Extract namespace from a cache key
   */
  getNamespace: (key: string): string | null => {
    const namespace = key.split(":")[0];
    const validNamespaces = Object.values(CACHE_NAMESPACES);
    return validNamespaces.includes(
      namespace as (typeof CACHE_NAMESPACES)[keyof typeof CACHE_NAMESPACES],
    )
      ? namespace
      : null;
  },

  /**
   * Check if a key matches a namespace pattern
   */
  matchesNamespace: (key: string, namespace: string): boolean => {
    return key.startsWith(`${namespace}:`);
  },

  /**
   * Create a pattern for bulk invalidation
   */
  createPattern: (namespace: string, suffix?: string): string => {
    const base = `${namespace}:`;
    return suffix ? `${base}${suffix}` : base;
  },
} as const;

/**
 * Example usage:
 *
 * // Cache a user's paper list
 * const key = cacheKeys.paper.list('user-123');
 *
 * // Cache a specific paper
 * const paperKey = cacheKeys.paper.detail('user-123', 'paper-456');
 *
 * // Invalidate all paper cache for a user
 * const pattern = cacheKeyUtils.createPattern(CACHE_NAMESPACES.PAPER, 'list:user-123');
 */
