import type { Paper, PaperFile, Solution } from "@prisma/client";
import { transformStatus } from "@/lib/transform-status";
import type {
  TransformedPaper,
  TransformedPaperFile,
  TransformedSolution,
} from "@/lib/types";

interface PaperRelations {
  files?: PaperFile[];
  solution?: { id: string } | null;
}

interface SolutionRelations {
  paper: Paper & {
    files?: PaperFile[];
  };
}

const serializePaperFile = (file: PaperFile): TransformedPaperFile => ({
  id: file.id,
  name: file.name,
  size: file.size,
  mimeType: file.mimeType,
  createdAt: file.createdAt.toISOString(),
});

export const serializePaper = (
  paper: Paper & PaperRelations,
): TransformedPaper => ({
  id: paper.id,
  userId: paper.userId,
  title: paper.title,
  pattern: paper.pattern,
  duration: paper.duration,
  totalMarks: paper.totalMarks,
  content: paper.content,
  status: transformStatus(paper.status),
  createdAt: paper.createdAt.toISOString(),
  updatedAt: paper.updatedAt.toISOString(),
  files: (paper.files ?? []).map(serializePaperFile),
  solution: paper.solution ? { id: paper.solution.id } : null,
});

export const serializeSolution = (
  solution: Solution & SolutionRelations,
): TransformedSolution => ({
  id: solution.id,
  paperId: solution.paperId,
  userId: solution.userId,
  content: solution.content,
  status: transformStatus(solution.status),
  createdAt: solution.createdAt.toISOString(),
  updatedAt: solution.updatedAt.toISOString(),
  paper: {
    id: solution.paper.id,
    title: solution.paper.title,
    pattern: solution.paper.pattern,
    duration: solution.paper.duration,
    totalMarks: solution.paper.totalMarks,
    createdAt: solution.paper.createdAt.toISOString(),
    files: (solution.paper.files ?? []).map(serializePaperFile),
  },
});
