import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import type { QuestionPaper, PapersData, SolutionDetail } from "./types";

// Fetch all papers - SESSION GUARDED
export function usePapers(): UseQueryResult<PapersData, Error> {
  const { data: session } = useSession();

  return useQuery<PapersData, Error>({
    queryKey: ["papers"],
    queryFn: async () => {
      const res = await fetch("/api/papers");
      if (!res.ok) throw new Error("Failed to fetch papers");
      return res.json();
    },
    enabled: !!session, // CRITICAL: Only run when session exists
    staleTime: 30000, // 30s - data fresh for 30s
    gcTime: 5 * 60 * 1000, // 5min - keep in cache for 5min
  });
}

// Fetch single paper - SESSION GUARDED
export function usePaper(
  id: string,
): UseQueryResult<{ paper: QuestionPaper }, Error> {
  const { data: session } = useSession();

  return useQuery<{ paper: QuestionPaper }, Error>({
    queryKey: ["paper", id],
    queryFn: async () => {
      const res = await fetch(`/api/papers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch paper");
      return res.json();
    },
    enabled: !!session && !!id, // CRITICAL: Session + ID required
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

// Fetch single solution - SESSION GUARDED
export function useSolution(
  id: string,
): UseQueryResult<{ solution: SolutionDetail }, Error> {
  const { data: session } = useSession();

  return useQuery<{ solution: SolutionDetail }, Error>({
    queryKey: ["solution", id],
    queryFn: async () => {
      const res = await fetch(`/api/solutions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch solution");
      return res.json();
    },
    enabled: !!session && !!id, // CRITICAL: Session + ID required
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

// Duplicate paper - FIXED: Uses cached data, handles race conditions
export function useDuplicatePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paperId }: { paperId: string }) => {
      // FIXED: Try cached data first, fallback to fetch
      let paperData: { paper: QuestionPaper };
      const cached = queryClient.getQueryData<{ paper: QuestionPaper }>([
        "paper",
        paperId,
      ]);

      if (cached) {
        paperData = cached;
      } else {
        const paperRes = await fetch(`/api/papers/${paperId}`);
        if (!paperRes.ok) throw new Error("Paper not found");
        paperData = await paperRes.json();
      }

      // Fetch solution if exists
      let solutionContent: string | null = null;
      let solutionStatus: "completed" | "in_progress" = "completed";

      if (paperData.paper.solution) {
        const cachedSol = queryClient.getQueryData<{
          solution: SolutionDetail;
        }>(["solution", paperData.paper.solution.id]);

        if (cachedSol) {
          solutionContent = cachedSol.solution.content;
          solutionStatus = cachedSol.solution.status;
        } else {
          const solRes = await fetch(
            `/api/solutions/${paperData.paper.solution.id}`,
          );
          if (solRes.ok) {
            const solData = await solRes.json();
            solutionContent = solData.solution?.content || null;
            solutionStatus = solData.solution?.status || "completed";
          }
        }
      }

      // Create duplicate
      const duplicateRes = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${paperData.paper.title} (Copy)`,
          pattern: paperData.paper.pattern,
          duration: paperData.paper.duration,
          totalMarks: paperData.paper.totalMarks,
          content: paperData.paper.content,
          ...(solutionContent && {
            solution: { content: solutionContent, status: solutionStatus },
          }),
        }),
      });

      if (!duplicateRes.ok) throw new Error("Failed to duplicate paper");
      return duplicateRes.json();
    },

    onMutate: async ({ paperId }) => {
      await queryClient.cancelQueries({ queryKey: ["papers"] });
      const previousData = queryClient.getQueryData<PapersData>(["papers"]);

      if (previousData) {
        const cached = queryClient.getQueryData<{ paper: QuestionPaper }>([
          "paper",
          paperId,
        ]);
        if (!cached) return { previousData };

        const tempId = `temp-${Date.now()}`;
        const tempSolutionId = cached.paper.solution
          ? `temp-sol-${Date.now()}`
          : null;

        const optimisticPaper: QuestionPaper = {
          ...cached.paper,
          id: tempId,
          title: `${cached.paper.title} (Copy)`,
          createdAt: new Date().toISOString(),
          solution: tempSolutionId ? { id: tempSolutionId } : null,
        };

        queryClient.setQueryData<PapersData>(["papers"], (old) => {
          if (!old) return old;
          return {
            ...old,
            papers: [optimisticPaper, ...old.papers],
            solutions: tempSolutionId
              ? [{ paperId: tempId, id: tempSolutionId }, ...old.solutions]
              : old.solutions,
          };
        });
      }

      return { previousData };
    },

    onSuccess: () => {
      // FIXED: Invalidate to get real IDs, but keep optimistic until refetch
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      toast.success("Paper duplicated");
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["papers"], context.previousData);
      }
      toast.error("Failed to duplicate paper", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Delete paper - with optimistic update
export function useDeletePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paperId: string) => {
      const res = await fetch(`/api/papers/${paperId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete paper");
      return { paperId };
    },

    onMutate: async (paperId) => {
      await queryClient.cancelQueries({ queryKey: ["papers"] });
      await queryClient.cancelQueries({ queryKey: ["paper", paperId] });

      const previousPapers = queryClient.getQueryData<PapersData>(["papers"]);
      const previousPaper = queryClient.getQueryData<{ paper: QuestionPaper }>([
        "paper",
        paperId,
      ]);

      queryClient.setQueryData<PapersData>(["papers"], (old) => {
        if (!old) return old;
        return {
          ...old,
          papers: old.papers.filter((p) => p.id !== paperId),
          solutions: old.solutions.filter((s) => s.paperId !== paperId),
        };
      });

      queryClient.removeQueries({ queryKey: ["paper", paperId] });

      return { previousPapers, previousPaper };
    },

    onSuccess: () => {
      // Cache already updated optimistically
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },

    onError: (error, paperId, context) => {
      if (context?.previousPapers) {
        queryClient.setQueryData(["papers"], context.previousPapers);
      }
      if (context?.previousPaper) {
        queryClient.setQueryData(["paper", paperId], context.previousPaper);
      }
      toast.error("Failed to delete paper");
    },
  });
}

// Delete solution - with optimistic update
export function useDeleteSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (solutionId: string) => {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete solution");
      return { solutionId };
    },

    onMutate: async (solutionId) => {
      await queryClient.cancelQueries({ queryKey: ["solution", solutionId] });
      await queryClient.cancelQueries({ queryKey: ["papers"] });

      const previousSolution = queryClient.getQueryData<{
        solution: SolutionDetail;
      }>(["solution", solutionId]);
      const previousPapers = queryClient.getQueryData<PapersData>(["papers"]);

      // Remove from papers list
      if (previousPapers && previousSolution) {
        queryClient.setQueryData<PapersData>(["papers"], (old) => {
          if (!old) return old;
          return {
            ...old,
            solutions: old.solutions.filter((s) => s.id !== solutionId),
          };
        });
      }

      queryClient.removeQueries({ queryKey: ["solution", solutionId] });

      return { previousSolution, previousPapers };
    },

    onError: (error, solutionId, context) => {
      if (context?.previousSolution) {
        queryClient.setQueryData(
          ["solution", solutionId],
          context.previousSolution,
        );
      }
      if (context?.previousPapers) {
        queryClient.setQueryData(["papers"], context.previousPapers);
      }
      toast.error("Failed to delete solution");
    },
  });
}

// Regenerate paper - with optimistic status update
export function useRegeneratePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paperId,
      instructions,
    }: {
      paperId: string;
      instructions: string;
    }) => {
      const res = await fetch("/api/papers/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, instructions: instructions.trim() }),
      });

      if (res.status === 429) {
        throw new Error("Rate limit exceeded");
      }

      if (!res.ok) throw new Error("Regeneration failed");
      return res.json();
    },

    onMutate: async ({ paperId }) => {
      await queryClient.cancelQueries({ queryKey: ["paper", paperId] });
      await queryClient.cancelQueries({ queryKey: ["papers"] });

      const previousPaper = queryClient.getQueryData<{ paper: QuestionPaper }>([
        "paper",
        paperId,
      ]);
      const previousPapers = queryClient.getQueryData<PapersData>(["papers"]);

      // FIXED: Update both individual paper and list cache
      if (previousPaper) {
        queryClient.setQueryData<{ paper: QuestionPaper }>(
          ["paper", paperId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              paper: { ...old.paper, status: "in_progress" },
            };
          },
        );
      }

      if (previousPapers) {
        queryClient.setQueryData<PapersData>(["papers"], (old) => {
          if (!old) return old;
          return {
            ...old,
            papers: old.papers.map((p) =>
              p.id === paperId ? { ...p, status: "in_progress" as const } : p,
            ),
          };
        });
      }

      return { previousPaper, previousPapers };
    },

    onSuccess: (data, { paperId }) => {
      // FIXED: Update both caches with real data
      queryClient.setQueryData<{ paper: QuestionPaper }>(
        ["paper", paperId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            paper: {
              ...old.paper,
              content: data.content,
              status: "completed",
              updatedAt: data.updatedAt,
            },
          };
        },
      );

      queryClient.setQueryData<PapersData>(["papers"], (old) => {
        if (!old) return old;
        return {
          ...old,
          papers: old.papers.map((p) =>
            p.id === paperId
              ? {
                  ...p,
                  status: "completed" as const,
                  updatedAt: data.updatedAt,
                }
              : p,
          ),
        };
      });
    },

    onError: (error, { paperId }, context) => {
      if (context?.previousPaper) {
        queryClient.setQueryData(["paper", paperId], context.previousPaper);
      }
      if (context?.previousPapers) {
        queryClient.setQueryData(["papers"], context.previousPapers);
      }
      toast.error("Regeneration failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}
