"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { exportToPDF, type PaperData } from "@/lib/pdf-export-client";
import { SignedInHeader } from "@/components/home/SignedInHeader";
import { SearchBar } from "@/components/home/SearchBar";
import { ViewToggle } from "@/components/home/ViewToggle";
import { PaperCard } from "@/components/home/PaperCard";
import { PaperListItem } from "@/components/home/PaperListItem";
import { PaperCardSkeleton } from "@/components/home/PaperCardSkeleton";
import { PaperListSkeleton } from "@/components/home/PaperListSkeleton";
import { EmptyState } from "@/components/home/EmptyState";
import { NoResultsState } from "@/components/home/NoResultsState";

interface QuestionPaper {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  createdAt: string;
  status: "completed" | "in_progress";
  files: Array<{ name: string; size: number; mimeType: string }>;
  solution?: {
    id: string;
  } | null;
}

interface PapersData {
  papers: QuestionPaper[];
  solutions: Array<{ paperId: string; id: string }>;
}

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [papersData, setPapersData] = useState<PapersData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewMode, setViewModeState] = useState<"card" | "list">("card");
  const [exportingPaperId, setExportingPaperId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const fetchPapers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/papers");
      const data = await response.json();

      setPapersData({
        papers: data.papers || [],
        solutions: data.solutions || [],
      });
    } catch (error) {
      toast.error("Unable to load your papers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
      return;
    }

    if (session && !papersData) {
      fetchPapers();
    }
  }, [session, isPending, papersData, router, fetchPapers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current.get(openMenuId);
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const papersWithSolutions = useMemo(() => {
    if (!papersData) {
      return [];
    }

    const solutionMap = new Map(
      papersData.solutions.map((s) => [s.paperId, s.id]),
    );

    return papersData.papers.map((paper) => ({
      ...paper,
      solution: solutionMap.has(paper.id)
        ? { id: solutionMap.get(paper.id)! }
        : null,
    }));
  }, [papersData]);

  const filteredPapers = useMemo(() => {
    return papersWithSolutions.filter(
      (paper) =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.pattern.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [papersWithSolutions, searchQuery]);

  const handleQuickExport = useCallback(async (paperId: string) => {
    setExportingPaperId(paperId);

    try {
      const response = await fetch(`/api/papers/${paperId}`);
      const data = await response.json();

      if (!data.paper) {
        throw new Error("Paper not found");
      }

      const paperData: PaperData = {
        title: data.paper.title,
        pattern: data.paper.pattern,
        duration: data.paper.duration,
        totalMarks: data.paper.totalMarks,
        content: data.paper.content,
        createdAt: data.paper.createdAt,
      };

      await exportToPDF(paperData);
    } catch (error) {
      toast.error("Unable to export your paper", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setExportingPaperId(null);
      setOpenMenuId(null);
    }
  }, []);

  const handleDuplicate = useCallback(
    async (paperId: string) => {
      try {
        const response = await fetch(`/api/papers/${paperId}`);
        const data = await response.json();

        if (!data.paper) {
          throw new Error("Paper not found");
        }

        const duplicateResponse = await fetch("/api/papers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${data.paper.title} (Copy)`,
            pattern: data.paper.pattern,
            duration: data.paper.duration,
            totalMarks: data.paper.totalMarks,
            content: data.paper.content,
          }),
        });

        if (duplicateResponse.ok) {
          await fetchPapers();
        }
      } catch (error) {
        toast.error("Failed to duplicate paper");
      }
      setOpenMenuId(null);
    },
    [fetchPapers],
  );

  const handleDelete = useCallback(
    async (paperId: string) => {
      if (
        confirm(
          "Are you sure you want to delete this paper? This action cannot be undone.",
        )
      ) {
        try {
          const response = await fetch(`/api/papers/${paperId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            await fetchPapers();
          } else {
            throw new Error("Failed to delete paper");
          }
        } catch (error) {
          toast.error("Failed to delete paper");
        }
      }
      setOpenMenuId(null);
    },
    [fetchPapers],
  );

  const handleOpenSolution = useCallback(
    (solutionId: string) => {
      router.push(`/solution/${solutionId}`);
      setOpenMenuId(null);
    },
    [router],
  );

  const handleSignOut = async () => {
    try {
      const { signOut } = await import("@/lib/auth-client");
      await signOut();
      router.push("/signin");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleViewModeChange = useCallback((mode: "card" | "list") => {
    setViewModeState(mode);
  }, []);

  const handleMenuToggle = useCallback((menuId: string) => {
    setOpenMenuId((previous) => (previous === menuId ? null : menuId));
  }, []);

  const setMenuRef = useCallback((id: string) => {
    return (el: HTMLDivElement | null) => {
      if (el) {
        menuRefs.current.set(id, el);
      } else {
        menuRefs.current.delete(id);
      }
    };
  }, []);

  const papersSection = useMemo(() => {
    return (
      <section className="space-y-6">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredPapers.map((paper) => {
              const solutionId = paper.solution?.id;
              const menuId = `paper-${paper.id}`;

              return (
                <PaperCard
                  key={menuId}
                  paper={paper}
                  isMenuOpen={openMenuId === menuId}
                  isExporting={exportingPaperId === paper.id}
                  onMenuToggle={() => handleMenuToggle(menuId)}
                  onExport={() => handleQuickExport(paper.id)}
                  onDuplicate={() => handleDuplicate(paper.id)}
                  onDelete={() => handleDelete(paper.id)}
                  onOpenSolution={
                    solutionId
                      ? () => handleOpenSolution(solutionId)
                      : undefined
                  }
                  menuRef={setMenuRef(menuId)}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPapers.map((paper) => {
              const solutionId = paper.solution?.id;
              const menuId = `paper-${paper.id}`;

              return (
                <PaperListItem
                  key={menuId}
                  paper={paper}
                  isMenuOpen={openMenuId === menuId}
                  isExporting={exportingPaperId === paper.id}
                  onMenuToggle={() => handleMenuToggle(menuId)}
                  onExport={() => handleQuickExport(paper.id)}
                  onDuplicate={() => handleDuplicate(paper.id)}
                  onDelete={() => handleDelete(paper.id)}
                  onOpenSolution={
                    solutionId
                      ? () => handleOpenSolution(solutionId)
                      : undefined
                  }
                  menuRef={setMenuRef(menuId)}
                />
              );
            })}
          </div>
        )}
      </section>
    );
  }, [
    filteredPapers,
    viewMode,
    openMenuId,
    exportingPaperId,
    handleMenuToggle,
    handleQuickExport,
    handleDuplicate,
    handleDelete,
    handleOpenSolution,
    setMenuRef,
  ]);

  let content: ReactNode;

  if (isLoading) {
    content =
      viewMode === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <PaperCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <PaperListSkeleton key={index} />
          ))}
        </div>
      );
  } else if (filteredPapers.length === 0) {
    content = searchQuery ? <NoResultsState /> : <EmptyState />;
  } else {
    content = papersSection;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <SignedInHeader onSignOut={handleSignOut} />

        <header className="mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
                Your Quests
              </h1>
              <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Manage and organize your generated quests
              </p>
            </div>
            <Link
              href="/generate"
              className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
              style={{ touchAction: "manipulation" }}
            >
              <span>Create New Quest</span>
              <Plus
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-8">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </header>

        {content}
      </div>
    </div>
  );
}
