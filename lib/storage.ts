/**
 * Bulletproof client-side storage utility
 *
 * Features:
 * - SSR-safe with graceful fallbacks
 * - Type-safe with TypeScript
 * - JSON serialization/deserialization
 * - Error handling and validation
 * - Versioned storage schema
 * - Performance optimized with memoization
 */

// Storage schema version for future migrations
const STORAGE_VERSION = "1.0.0";

// Storage keys enum for type safety
export enum StorageKey {
  // Auth
  API_KEY = "openrouter_api_key",
  CODE_VERIFIER = "openrouter_code_verifier",
  AUTH_STATUS = "auth_status",
  AUTH_TIMESTAMP = "auth_timestamp",

  // User Preferences
  VIEW_MODE = "view_mode_preference",
  THEME = "theme_preference",

  // App Data
  PAPERS_METADATA = "papers_metadata",
  PAPER_CONTENT_PREFIX = "paper_content_",
  LAST_SYNC = "last_sync_timestamp",
  GENERATE_FORM_DRAFT = "generate_form_draft",

  // System
  STORAGE_VERSION = "storage_version",
}

// Types for stored data
export interface AuthStatus {
  isAuthenticated: boolean;
  hasApiKey: boolean;
  timestamp: number;
}

export interface PaperMetadata {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  status: "completed" | "in_progress";
  tags?: string[];
  files?: FileDescriptor[];
}

export interface FileDescriptor {
  name: string;
  size: number;
  type: string;
}

export type ViewMode = "card" | "list";
export type Theme = "light" | "dark" | "system";

export interface GenerateFormDraft {
  paperName: string;
  paperPattern: string;
  duration: string;
  totalMarks: string;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

/**
 * Safe localStorage wrapper with error handling
 */
class SafeStorage {
  private storage: Storage | null = null;
  private isSession: boolean;
  private cache: Map<string, any> = new Map();

  constructor(useSessionStorage = false) {
    this.isSession = useSessionStorage;
    if (isBrowser()) {
      try {
        this.storage = useSessionStorage
          ? window.sessionStorage
          : window.localStorage;
        // Test storage availability
        const testKey = "__storage_test__";
        this.storage.setItem(testKey, "test");
        this.storage.removeItem(testKey);
      } catch (error) {
        console.warn("Storage not available, using memory fallback:", error);
        this.storage = null;
      }
    }
  }

  /**
   * Get item from storage with type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    // Check cache first for performance
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if (!this.storage) {
      return defaultValue ?? null;
    }

    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }

      const parsed = JSON.parse(item) as T;
      this.cache.set(key, parsed);
      return parsed;
    } catch (error) {
      console.warn(`Failed to get item "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Get raw string from storage (no JSON parsing)
   */
  getRaw(key: string): string | null {
    if (!this.storage) {
      return null;
    }

    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get raw item "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in storage with JSON serialization
   */
  set<T>(key: string, value: T): boolean {
    if (!this.storage) {
      // Still update cache for in-memory fallback
      this.cache.set(key, value);
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
      this.cache.set(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set item "${key}":`, error);
      return false;
    }
  }

  /**
   * Set raw string in storage (no JSON serialization)
   */
  setRaw(key: string, value: string): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set raw item "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): boolean {
    this.cache.delete(key);

    if (!this.storage) {
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear(): boolean {
    this.cache.clear();

    if (!this.storage) {
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.warn("Failed to clear storage:", error);
      return false;
    }
  }

  /**
   * Check if key exists in storage
   */
  has(key: string): boolean {
    if (this.cache.has(key)) {
      return true;
    }

    if (!this.storage) {
      return false;
    }

    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear cache (useful for forcing reload from storage)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instances
const localStorage = new SafeStorage(false);
const sessionStorage = new SafeStorage(true);

/**
 * Initialize storage with version check
 */
export function initializeStorage(): void {
  if (!isBrowser()) return;

  const currentVersion = localStorage.getRaw(StorageKey.STORAGE_VERSION);

  if (!currentVersion) {
    // First time initialization
    localStorage.setRaw(StorageKey.STORAGE_VERSION, STORAGE_VERSION);
  } else if (currentVersion !== STORAGE_VERSION) {
    // Handle migrations if needed in the future
    console.log(
      `Migrating storage from ${currentVersion} to ${STORAGE_VERSION}`,
    );
    localStorage.setRaw(StorageKey.STORAGE_VERSION, STORAGE_VERSION);
  }
}

// ==================== AUTH DOMAIN ====================

/**
 * Get stored API key
 */
export function getApiKey(): string | null {
  return localStorage.getRaw(StorageKey.API_KEY);
}

/**
 * Set API key
 */
export function setApiKey(key: string): boolean {
  const success = localStorage.setRaw(StorageKey.API_KEY, key);
  if (success) {
    updateAuthStatus(true);
  }
  return success;
}

/**
 * Clear API key
 */
export function clearApiKey(): boolean {
  const success = localStorage.remove(StorageKey.API_KEY);
  if (success) {
    updateAuthStatus(false);
  }
  return success;
}

/**
 * Get OAuth code verifier (session storage)
 */
export function getCodeVerifier(): string | null {
  return sessionStorage.getRaw(StorageKey.CODE_VERIFIER);
}

/**
 * Set OAuth code verifier (session storage)
 */
export function setCodeVerifier(verifier: string): boolean {
  return sessionStorage.setRaw(StorageKey.CODE_VERIFIER, verifier);
}

/**
 * Clear OAuth code verifier
 */
export function clearCodeVerifier(): boolean {
  return sessionStorage.remove(StorageKey.CODE_VERIFIER);
}

/**
 * Get authentication status
 */
export function getAuthStatus(): AuthStatus | null {
  return localStorage.get<AuthStatus>(StorageKey.AUTH_STATUS);
}

/**
 * Update authentication status
 */
export function updateAuthStatus(isAuthenticated: boolean): boolean {
  const status: AuthStatus = {
    isAuthenticated,
    hasApiKey: !!getApiKey(),
    timestamp: Date.now(),
  };
  return localStorage.set(StorageKey.AUTH_STATUS, status);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const apiKey = getApiKey();
  return !!apiKey;
}

/**
 * Clear all auth data (sign out)
 */
export function clearAuthData(): boolean {
  clearApiKey();
  clearCodeVerifier();
  localStorage.remove(StorageKey.AUTH_STATUS);
  localStorage.remove(StorageKey.AUTH_TIMESTAMP);
  return true;
}

// ==================== USER PREFERENCES ====================

/**
 * Get view mode preference
 */
export function getViewMode(): ViewMode {
  return localStorage.get<ViewMode>(StorageKey.VIEW_MODE, "card") ?? "card";
}

/**
 * Set view mode preference
 */
export function setViewMode(mode: ViewMode): boolean {
  return localStorage.set(StorageKey.VIEW_MODE, mode);
}

/**
 * Get theme preference
 */
export function getTheme(): Theme {
  return localStorage.get<Theme>(StorageKey.THEME, "system") ?? "system";
}

/**
 * Set theme preference
 */
export function setTheme(theme: Theme): boolean {
  return localStorage.set(StorageKey.THEME, theme);
}

// ==================== GENERATE FORM DRAFT ====================

/**
 * Get generate form draft
 */
export function getGenerateFormDraft(): GenerateFormDraft | null {
  return localStorage.get<GenerateFormDraft>(StorageKey.GENERATE_FORM_DRAFT);
}

/**
 * Set generate form draft
 */
export function setGenerateFormDraft(draft: GenerateFormDraft): boolean {
  return localStorage.set(StorageKey.GENERATE_FORM_DRAFT, draft);
}

/**
 * Clear generate form draft
 */
export function clearGenerateFormDraft(): boolean {
  return localStorage.remove(StorageKey.GENERATE_FORM_DRAFT);
}

// ==================== PAPERS METADATA ====================

/**
 * Get all papers metadata
 */
export function getPapersMetadata(): PaperMetadata[] {
  return (
    localStorage.get<PaperMetadata[]>(StorageKey.PAPERS_METADATA, []) ?? []
  );
}

/**
 * Set papers metadata
 */
export function setPapersMetadata(papers: PaperMetadata[]): boolean {
  const success = localStorage.set(StorageKey.PAPERS_METADATA, papers);
  if (success) {
    localStorage.set(StorageKey.LAST_SYNC, Date.now());
  }
  return success;
}

/**
 * Add or update a single paper
 */
export function upsertPaper(paper: PaperMetadata): boolean {
  const papers = getPapersMetadata();
  const existingIndex = papers.findIndex((p) => p.id === paper.id);

  if (existingIndex >= 0) {
    papers[existingIndex] = { ...paper, updatedAt: new Date().toISOString() };
  } else {
    papers.push(paper);
  }

  return setPapersMetadata(papers);
}

/**
 * Delete a paper by ID
 */
export function deletePaper(paperId: string): boolean {
  const papers = getPapersMetadata();
  const filtered = papers.filter((p) => p.id !== paperId);
  deletePaperContent(paperId);
  return setPapersMetadata(filtered);
}

/**
 * Get a single paper by ID
 */
export function getPaper(paperId: string): PaperMetadata | null {
  const papers = getPapersMetadata();
  return papers.find((p) => p.id === paperId) ?? null;
}

export function setPaperStatus(
  paperId: string,
  status: PaperMetadata["status"],
): PaperMetadata | null {
  const paper = getPaper(paperId);
  if (!paper) {
    return null;
  }

  paper.status = status;
  paper.updatedAt = new Date().toISOString();
  upsertPaper(paper);
  return paper;
}

/**
 * Clear all papers metadata
 */
export function clearPapersMetadata(): boolean {
  return localStorage.remove(StorageKey.PAPERS_METADATA);
}

/**
 * Get last sync timestamp
 */
export function getLastSync(): number | null {
  return localStorage.get<number>(StorageKey.LAST_SYNC);
}

/**
 * Get paper content (markdown) by ID
 */
export function getPaperContent(paperId: string): string | null {
  return localStorage.getRaw(`${StorageKey.PAPER_CONTENT_PREFIX}${paperId}`);
}

/**
 * Set paper content (markdown) by ID
 */
export function setPaperContent(paperId: string, content: string): boolean {
  return localStorage.setRaw(
    `${StorageKey.PAPER_CONTENT_PREFIX}${paperId}`,
    content,
  );
}

/**
 * Delete paper content by ID
 */
export function deletePaperContent(paperId: string): boolean {
  return localStorage.remove(`${StorageKey.PAPER_CONTENT_PREFIX}${paperId}`);
}

/**
 * Create a new paper with "in_progress" status
 */
export function createPaper(
  title: string,
  pattern: string,
  duration: string,
  totalMarks: number,
  files?: FileDescriptor[],
): PaperMetadata {
  const paper: PaperMetadata = {
    id: `paper_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    title,
    pattern,
    duration,
    totalMarks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "in_progress",
    files: files || [],
  };

  upsertPaper(paper);
  return paper;
}

/**
 * Update paper status and content
 */
export function completePaper(
  paperId: string,
  content: string,
): PaperMetadata | null {
  const paper = getPaper(paperId);
  if (!paper) return null;

  paper.status = "completed";
  paper.updatedAt = new Date().toISOString();

  setPaperContent(paperId, content);
  upsertPaper(paper);

  return paper;
}

/**
 * Duplicate a paper with all its content
 */
export function duplicatePaper(paperId: string): PaperMetadata | null {
  const originalPaper = getPaper(paperId);
  if (!originalPaper) return null;

  const originalContent = getPaperContent(paperId);
  if (!originalContent) return null;

  const newPaper: PaperMetadata = {
    ...originalPaper,
    id: `paper_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    title: `${originalPaper.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  upsertPaper(newPaper);
  setPaperContent(newPaper.id, originalContent);

  return newPaper;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all app data (nuclear option)
 */
export function clearAllData(): boolean {
  clearAuthData();
  clearPapersMetadata();
  localStorage.remove(StorageKey.VIEW_MODE);
  localStorage.remove(StorageKey.THEME);
  localStorage.remove(StorageKey.LAST_SYNC);
  return true;
}

/**
 * Export all storage data (for backup/debugging)
 */
export function exportStorageData(): Record<string, any> {
  if (!isBrowser()) return {};

  const data: Record<string, any> = {};

  try {
    Object.values(StorageKey).forEach((key) => {
      const value = localStorage.get(key);
      if (value !== null) {
        data[key] = value;
      }
    });
  } catch (error) {
    console.error("Failed to export storage data:", error);
  }

  return data;
}

/**
 * Get storage statistics
 */
export function getStorageStats(): {
  isAvailable: boolean;
  itemCount: number;
  estimatedSize: string;
} {
  if (!isBrowser()) {
    return { isAvailable: false, itemCount: 0, estimatedSize: "0 B" };
  }

  let itemCount = 0;
  let totalSize = 0;

  try {
    Object.values(StorageKey).forEach((key) => {
      const value = window.localStorage.getItem(key);
      if (value !== null) {
        itemCount++;
        totalSize += value.length + key.length;
      }
    });
  } catch (error) {
    console.error("Failed to get storage stats:", error);
  }

  // Convert bytes to human-readable format
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return {
    isAvailable: true,
    itemCount,
    estimatedSize: formatSize(totalSize * 2), // UTF-16 = 2 bytes per char
  };
}

// Initialize storage on module load
if (isBrowser()) {
  initializeStorage();
}
