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
