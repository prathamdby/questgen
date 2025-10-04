"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  const [isHydrated, setIsHydrated] = useState(false);
  const [exportingPaperId, setExportingPaperId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize view mode from storage after hydration
  useEffect(() => {
    const savedViewMode = getViewMode();
    setViewModeState(savedViewMode);
    setIsHydrated(true);
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

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
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

  const getStatusStyles = (status: QuestionPaper["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]";
      case "in_progress":
        return "bg-[#fef08a] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleQuickExport = async (paperId: string) => {
    setExportingPaperId(paperId);

    try {
      // Get paper data from storage
      const metadata = getPaper(paperId);
      let content = getPaperContent(paperId);

      if (!metadata || !content) {
        throw new Error("Paper not found");
      }

      // Clean content to remove any code fence wrappers
      content = content.trim();
      content = content.replace(/^```(?:markdown|md)?\s*\n/i, "");
      content = content.replace(/\n```\s*$/i, "");
      content = content.trim();

      // Call the export API
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

      // Get the PDF blob
      const blob = await response.blob();

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${metadata.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert(
        `Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setExportingPaperId(null);
      setOpenMenuId(null);
    }
  };

  const handleDuplicate = (paperId: string) => {
    const duplicatedPaper = duplicatePaper(paperId);
    if (duplicatedPaper) {
      // Reload papers from storage
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
      // Reload papers from storage
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
        {/* Signed In Indicator */}
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373]">
            <Image
              src="/openrouter.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 dark:invert"
              aria-hidden="true"
            />
            <span>Signed in with OpenRouter</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[14px] font-[500] text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
          >
            Sign out
          </button>
        </div>

        {/* Header */}
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
              <svg
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mt-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-[#737373]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block h-[44px] w-full rounded-[6px] border border-[#e5e5e5] bg-white pl-10 pr-3 text-[15px] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-label="Search question papers"
            />
          </div>

          {/* View Toggle */}
          <div className="mt-4 flex justify-end">
            <div className="inline-flex gap-1 rounded-[6px] border border-[#e5e5e5] bg-white p-1 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <button
                onClick={() => handleViewModeChange("card")}
                aria-label="Card view"
                aria-pressed={viewMode === "card"}
                className={`flex h-7 w-7 items-center justify-center rounded-[4px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white ${
                  viewMode === "card"
                    ? "bg-[#f5f5f5] text-[#171717] dark:bg-[#171717] dark:text-white"
                    : "text-[#737373] hover:bg-[#fafafa] hover:text-[#171717] dark:hover:bg-[#171717] dark:hover:text-white"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`flex h-7 w-7 items-center justify-center rounded-[4px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white ${
                  viewMode === "list"
                    ? "bg-[#f5f5f5] text-[#171717] dark:bg-[#171717] dark:text-white"
                    : "text-[#737373] hover:bg-[#fafafa] hover:text-[#171717] dark:hover:bg-[#171717] dark:hover:text-white"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Papers Grid/List */}
        {filteredPapers.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/paper/${paper.id}`}
                  className="group block rounded-[6px] border border-[#e5e5e5] bg-white p-5 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
                >
                  {/* Paper Header */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[16px] font-[500] text-[#171717] dark:text-white">
                        {paper.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#737373] line-clamp-1">
                        {paper.pattern}
                      </p>
                    </div>
                    <div
                      className="relative"
                      ref={openMenuId === paper.id ? menuRef : null}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === paper.id ? null : paper.id,
                          );
                        }}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-[#737373] transition-all duration-150 hover:bg-[#fafafa] hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:hover:bg-[#171717] dark:hover:text-white dark:focus:ring-white"
                        aria-label="Paper options"
                        aria-expanded={openMenuId === paper.id}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === paper.id && (
                        <div className="absolute right-0 top-8 z-10 w-[180px] rounded-[6px] border border-[#e5e5e5] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickExport(paper.id);
                            }}
                            disabled={exportingPaperId === paper.id}
                            className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] transition-all duration-150 ${
                              exportingPaperId === paper.id
                                ? "cursor-not-allowed bg-[#f5f5f5] text-[#a3a3a3] dark:bg-[#171717] dark:text-[#666666]"
                                : "text-[#171717] hover:bg-[#fafafa] dark:text-white dark:hover:bg-[#171717]"
                            }`}
                          >
                            {exportingPaperId === paper.id ? (
                              <svg
                                className="h-4 w-4 animate-spin text-[#737373]"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4 text-[#737373]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            )}
                            <span className="font-[500]">
                              {exportingPaperId === paper.id
                                ? "Exporting..."
                                : "Quick Export"}
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDuplicate(paper.id);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#171717] transition-all duration-150 hover:bg-[#fafafa] dark:text-white dark:hover:bg-[#171717]"
                          >
                            <svg
                              className="h-4 w-4 text-[#737373]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="font-[500]">Duplicate</span>
                          </button>
                          <div className="my-1 h-px bg-[#e5e5e5] dark:bg-[#333333]" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(paper.id);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#ef4444] transition-all duration-150 hover:bg-[#fef2f2] dark:text-[#f87171] dark:hover:bg-[#450a0a]"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="font-[500]">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Paper Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-[13px]">
                    <span
                      className={`rounded-[4px] px-2 py-0.5 text-[12px] font-[500] ${getStatusStyles(
                        paper.status,
                      )}`}
                    >
                      {paper.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#737373]">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {paper.duration}
                    </span>
                    <span className="flex items-center gap-1.5 tabular-nums text-[#737373]">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {paper.totalMarks} marks
                    </span>
                  </div>

                  {/* Paper Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#f5f5f5] pt-4 dark:border-[#262626]">
                    <span className="text-[12px] tabular-nums text-[#a3a3a3]">
                      {formatDate(paper.createdAt)}
                    </span>
                    <span className="text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white">
                      View details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/paper/${paper.id}`}
                  className="group flex items-center justify-between gap-4 rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-[15px] font-[500] text-[#171717] dark:text-white">
                          {paper.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 rounded-[4px] px-1.5 py-0.5 text-[11px] font-[500] ${getStatusStyles(
                            paper.status,
                          )}`}
                        >
                          {paper.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[13px] text-[#737373]">
                        {paper.pattern}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4 text-[13px] text-[#737373]">
                      <span className="hidden items-center gap-1.5 sm:flex">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {paper.duration}
                      </span>
                      <span className="hidden items-center gap-1.5 tabular-nums sm:flex">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {paper.totalMarks} marks
                      </span>
                      <span className="tabular-nums text-[12px] text-[#a3a3a3]">
                        {formatDate(paper.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="hidden text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white sm:block">
                      View →
                    </span>
                    <div
                      className="relative"
                      ref={openMenuId === paper.id ? menuRef : null}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === paper.id ? null : paper.id,
                          );
                        }}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-[#737373] transition-all duration-150 hover:bg-[#fafafa] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:hover:bg-[#171717] dark:hover:text-white dark:focus-visible:ring-white"
                        aria-label="Paper options"
                        aria-expanded={openMenuId === paper.id}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === paper.id && (
                        <div className="absolute right-0 top-8 z-10 w-[180px] rounded-[6px] border border-[#e5e5e5] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickExport(paper.id);
                            }}
                            disabled={exportingPaperId === paper.id}
                            className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] transition-all duration-150 ${
                              exportingPaperId === paper.id
                                ? "cursor-not-allowed bg-[#f5f5f5] text-[#a3a3a3] dark:bg-[#171717] dark:text-[#666666]"
                                : "text-[#171717] hover:bg-[#fafafa] dark:text-white dark:hover:bg-[#171717]"
                            }`}
                          >
                            {exportingPaperId === paper.id ? (
                              <svg
                                className="h-4 w-4 animate-spin text-[#737373]"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4 text-[#737373]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            )}
                            <span className="font-[500]">
                              {exportingPaperId === paper.id
                                ? "Exporting..."
                                : "Quick Export"}
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDuplicate(paper.id);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#171717] transition-all duration-150 hover:bg-[#fafafa] dark:text-white dark:hover:bg-[#171717]"
                          >
                            <svg
                              className="h-4 w-4 text-[#737373]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="font-[500]">Duplicate</span>
                          </button>
                          <div className="my-1 h-px bg-[#e5e5e5] dark:bg-[#333333]" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(paper.id);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#ef4444] transition-all duration-150 hover:bg-[#fef2f2] dark:text-[#f87171] dark:hover:bg-[#450a0a]"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="font-[500]">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : searchQuery ? (
          // No Search Results
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
              <svg
                className="h-8 w-8 text-[#737373]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-[17px] font-[500] text-[#171717] dark:text-white">
              No papers found
            </h3>
            <p className="mt-2 text-[14px] text-[#737373]">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
              <svg
                className="h-10 w-10 text-[#737373]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-[20px] font-[500] text-[#171717] dark:text-white">
              No question papers yet
            </h3>
            <p className="mt-2 text-[15px] text-[#737373]">
              Create your first question paper to get started
            </p>
            <Link
              href="/generate"
              className="mt-6 flex h-[44px] items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              style={{ touchAction: "manipulation" }}
            >
              Create your first paper
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
