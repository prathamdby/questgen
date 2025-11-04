"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { isAuthenticated, clearStoredApiKey } from "@/lib/openrouter-auth";
import {
  getViewMode,
  setViewMode,
  getPapersMetadata,
  getPaper,
  getPaperContent,
  deletePaper,
  duplicatePaper,
  type ViewMode,
} from "@/lib/storage";
import { SignedInHeader } from "@/components/home/SignedInHeader";
import { SearchBar } from "@/components/home/SearchBar";
import { ViewToggle } from "@/components/home/ViewToggle";
import { PaperCard } from "@/components/home/PaperCard";
import { PaperListItem } from "@/components/home/PaperListItem";
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
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewMode, setViewModeState] = useState<ViewMode>("card");
  const [exportingPaperId, setExportingPaperId] = useState<string | null>(null);
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const savedViewMode = getViewMode();
    setViewModeState(savedViewMode);
  }, []);

  useEffect(() => {
    const loadPapers = () => {
      setPapers(getPapersMetadata());
    };

    loadPapers();

    const handleFocus = () => {
      loadPapers();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadPapers();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key.includes("paper")) {
        loadPapers();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);

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

  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.pattern.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleQuickExport = async (paperId: string) => {
    setExportingPaperId(paperId);

    try {
      const metadata = getPaper(paperId);
      let content = getPaperContent(paperId);

      if (!metadata || !content) {
        throw new Error("Paper not found");
      }

      content = content.trim();
      content = content.replace(/^```(?:markdown|md)?\s*\n/i, "");
      content = content.replace(/\n```\s*$/i, "");
      content = content.trim();

      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: metadata.title,
          pattern: metadata.pattern,
          duration: metadata.duration,
          totalMarks: metadata.totalMarks,
          content: content,
          createdAt: metadata.createdAt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to export PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${metadata.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert(
        `Failed to export PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setExportingPaperId(null);
      setOpenMenuId(null);
    }
  };

  const handleDuplicate = (paperId: string) => {
    const duplicatedPaper = duplicatePaper(paperId);
    if (duplicatedPaper) {
      setPapers(getPapersMetadata());
    }
    setOpenMenuId(null);
  };

  const handleDelete = (paperId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this paper? This action cannot be undone.",
      )
    ) {
      deletePaper(paperId);
      setPapers(getPapersMetadata());
    }
    setOpenMenuId(null);
  };

  const handleSignOut = () => {
    clearStoredApiKey();
    router.push("/signin");
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewModeState(mode);
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
        <SignedInHeader onSignOut={handleSignOut} />

        <header className="mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
                Question Papers
              </h1>
              <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Manage and organize your generated question papers
              </p>
            </div>
            <Link
              href="/generate"
              className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
              style={{ touchAction: "manipulation" }}
            >
              <span>Create New Paper</span>
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

        {filteredPapers.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isMenuOpen={openMenuId === paper.id}
                  isExporting={exportingPaperId === paper.id}
                  onMenuToggle={() =>
                    setOpenMenuId(openMenuId === paper.id ? null : paper.id)
                  }
                  onExport={() => handleQuickExport(paper.id)}
                  onDuplicate={() => handleDuplicate(paper.id)}
                  onDelete={() => handleDelete(paper.id)}
                  menuRef={(el) => {
                    if (el) {
                      menuRefs.current.set(paper.id, el);
                    } else {
                      menuRefs.current.delete(paper.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPapers.map((paper) => (
                <PaperListItem
                  key={paper.id}
                  paper={paper}
                  isMenuOpen={openMenuId === paper.id}
                  isExporting={exportingPaperId === paper.id}
                  onMenuToggle={() =>
                    setOpenMenuId(openMenuId === paper.id ? null : paper.id)
                  }
                  onExport={() => handleQuickExport(paper.id)}
                  onDuplicate={() => handleDuplicate(paper.id)}
                  onDelete={() => handleDelete(paper.id)}
                  menuRef={(el) => {
                    if (el) {
                      menuRefs.current.set(paper.id, el);
                    } else {
                      menuRefs.current.delete(paper.id);
                    }
                  }}
                />
              ))}
            </div>
          )
        ) : searchQuery ? (
          <NoResultsState />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
