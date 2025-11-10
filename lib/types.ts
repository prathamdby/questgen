/**
 * Shared type definitions for transformed data
 * Used by both server and client components to ensure type safety
 */

export interface TransformedPaperFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string; // ISO string
}

/**
 * Paper list item type (excludes content for performance)
 * Used in home page list views where content is not needed
 */
export interface PaperListItem {
  id: string;
  userId: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  status: "completed" | "in_progress";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  files: TransformedPaperFile[];
  solution?: {
    id: string;
  } | null;
}

/**
 * Full paper type (includes content)
 * Used in detail views where full content is needed
 */
export interface TransformedPaper {
  id: string;
  userId: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  content: string;
  status: "completed" | "in_progress";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  files: TransformedPaperFile[];
  solution?: {
    id: string;
  } | null;
}

export interface TransformedSolution {
  id: string;
  paperId: string;
  userId: string;
  content: string;
  status: "completed" | "in_progress";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  paper: {
    id: string;
    title: string;
    pattern: string;
    duration: string;
    totalMarks: number;
    createdAt: string; // ISO string
    files?: TransformedPaperFile[];
  };
}

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}
