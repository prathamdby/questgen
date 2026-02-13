export interface QuestionPaper {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  status: "completed" | "in_progress";
  files: Array<{
    id?: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt?: string;
  }>;
  tags?: Array<{ id: string; tag: string }>;
  solution?: { id: string } | null;
}

export interface PapersData {
  papers: QuestionPaper[];
  solutions: Array<{ paperId: string; id: string }>;
}

export interface SolutionDetail {
  id: string;
  paperId: string;
  content: string;
  status: "completed" | "in_progress";
  createdAt: string;
  updatedAt: string;
  paper: {
    id: string;
    title: string;
    pattern: string;
    duration: string;
    totalMarks: number;
    createdAt: string;
    files?: Array<{ name: string; mimeType: string; size: number }>;
  };
}

export interface RegeneratePaperResponse {
  success: boolean;
  content: string;
  updatedAt: string;
  solutionId?: string;
  solutionContent?: string;
  solutionUpdatedAt?: string;
  solutionError?: string | null;
}

export interface ShareLink {
  id: string;
  token: string;
  url: string;
  paperId: string | null;
  solutionId: string | null;
  title: string;
  type: "paper" | "solution";
  expiresAt: string | null;
  createdAt: string;
}

export interface ShareLinksData {
  shareLinks: ShareLink[];
}

export interface GenerationDefaults {
  defaultPattern: string | null;
  defaultPatternPresetId: string | null;
  defaultDuration: string | null;
  defaultTotalMarks: string | null;
  defaultGenerationMode: "FROM_SCRATCH" | "PAST_PAPERS" | null;
  defaultStrategy: string | null;
  defaultGenerateSolution: boolean;
}

export interface CreateShareLinkResponse {
  shareLink: {
    id: string;
    token: string;
    url: string;
    paperId: string | null;
    solutionId: string | null;
    expiresAt: string | null;
  };
}
