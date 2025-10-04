"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPaper, getPaperContent, deletePaper } from "@/lib/storage";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

interface QuestionPaper {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  createdAt: string;
  status: "completed" | "in_progress";
  files?: UploadedFile[];
  content: string;
}

export default function PaperPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load paper from storage
  useEffect(() => {
    const metadata = getPaper(id);
    let content = getPaperContent(id);

    if (metadata && content) {
      // Clean content to remove any code fence wrappers
      content = content.trim();
      content = content.replace(/^```(?:markdown|md)?\s*\n/i, "");
      content = content.replace(/\n```\s*$/i, "");
      content = content.trim();

      setPaper({
        id: metadata.id,
        title: metadata.title,
        pattern: metadata.pattern,
        duration: metadata.duration,
        totalMarks: metadata.totalMarks,
        createdAt: metadata.createdAt,
        status: metadata.status,
        files: metadata.files?.map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
        })),
        content,
      });
    }

    setIsLoading(false);
  }, [id]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    // Extract extension from filename
    const extension = filename.split(".").pop()?.toLowerCase() || "";

    switch (extension) {
      case "pdf":
        return (
          <svg
            className="h-4 w-4 text-[#ef4444]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
      case "bmp":
      case "ico":
        return (
          <svg
            className="h-4 w-4 text-[#8b5cf6]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <circle cx="10" cy="12" r="2" />
            <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
          </svg>
        );
      case "docx":
      case "doc":
        return (
          <svg
            className="h-4 w-4 text-[#2b579a]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6M10 18l-3-6h2l2 4 2-4h2l-3 6h-2z" />
          </svg>
        );
      case "md":
      case "txt":
        return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
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
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-[#737373]"
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
          <p className="mt-4 text-[15px] text-[#737373]">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="mx-auto max-w-2xl px-6 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
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
                <circle cx="18" cy="6" r="1" fill="currentColor" />
                <circle cx="18" cy="6" r="2.5" fill="none" strokeWidth={1.5} />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-10">
            <h1 className="font-sans text-[32px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
              This paper went missing
            </h1>
            <p className="mt-4 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              The paper you're looking for doesn't exist or may have been
              deleted. Let's get you back on track.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/home"
              className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
              style={{ touchAction: "manipulation" }}
            >
              <span>Browse Papers</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/generate"
              className="flex h-[44px] w-full items-center justify-center rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
            >
              Create New Paper
            </Link>
          </div>

          {/* Helper Links */}
          <div className="mt-12 flex items-center justify-center gap-6 text-[14px]">
            <Link
              href="/home"
              className="text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
            >
              Go Home
            </Link>
            <span className="text-[#e5e5e5] dark:text-[#333333]">·</span>
            <Link
              href="/generate"
              className="text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
            >
              Generate Paper
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // TODO: Implement regeneration logic
    console.log("Regenerating paper:", paper.id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRegenerating(false);
  };

  const handleExport = async () => {
    if (!paper) return;

    setIsExporting(true);

    try {
      // Call the export API
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: paper.title,
          pattern: paper.pattern,
          duration: paper.duration,
          totalMarks: paper.totalMarks,
          content: paper.content,
          createdAt: paper.createdAt,
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
      a.download = `${paper.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert(
        `Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = () => {
    if (!paper) return;

    if (
      confirm(
        "Are you sure you want to delete this paper? This action cannot be undone."
      )
    ) {
      deletePaper(paper.id);
      router.push("/home");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* Back Link */}
        <Link
          href="/home"
          className="group mb-8 inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
        >
          <svg
            className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to papers</span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-[4px] px-2 py-0.5 text-[12px] font-[500] ${getStatusStyles(
                paper.status
              )}`}
            >
              {paper.status === "completed" ? "Completed" : "In Progress"}
            </span>
            <span className="text-[13px] tabular-nums text-[#a3a3a3]">
              Created {formatDate(paper.createdAt)}
            </span>
          </div>

          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {paper.title}
          </h1>

          {/* Metadata Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 2v4" />
                  <path d="M12 2v4" />
                  <path d="M16 2v4" />
                  <rect width="16" height="18" x="4" y="4" rx="2" />
                  <path d="M8 10h6" />
                  <path d="M8 14h8" />
                  <path d="M8 18h5" />
                </svg>
                Pattern
              </div>
              <p
                className="truncate text-[14px] text-[#171717] dark:text-white"
                title={paper.pattern}
              >
                {paper.pattern}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 0 1 7.38 16.75" />
                  <path d="M12 6v6l4 2" />
                  <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
                  <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
                  <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
                  <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
                </svg>
                Duration
              </div>
              <p className="text-[14px] text-[#171717] dark:text-white">
                {paper.duration}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="8" height="18" x="3" y="3" rx="1" />
                  <path d="M7 3v18" />
                  <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
                </svg>
                Total Marks
              </div>
              <p className="text-[14px] tabular-nums text-[#171717] dark:text-white">
                {paper.totalMarks}
              </p>
            </div>
          </div>

          {/* Source Files Section (Collapsible) */}
          {paper.files && paper.files.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="flex w-full items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white p-4 text-left transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
                aria-expanded={notesExpanded}
                aria-controls="files-content"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#737373]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M2 15h10" />
                    <path d="m9 18 3-3-3-3" />
                  </svg>
                  <span className="text-[14px] font-[500] text-[#171717] dark:text-white">
                    Source Files ({paper.files.length})
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-[#737373] transition-transform duration-200 ${
                    notesExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {notesExpanded && (
                <div id="files-content" className="mt-2 space-y-2">
                  {paper.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#fafafa] dark:bg-[#171717]">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-[500] text-[#171717] dark:text-white">
                            {file.name}
                          </p>
                          <p className="mt-0.5 text-[12px] tabular-nums text-[#737373]">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={`group flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating
                  ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
                  : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-busy={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                  <span>Regen...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Regen</span>
                </>
              )}
            </button>

            <button
              onClick={handleExport}
              disabled={isRegenerating || isExporting}
              className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating || isExporting
                  ? "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] dark:border-[#333333] dark:bg-[#171717] dark:text-[#666666]"
                  : "border-[#e5e5e5] bg-white text-[#171717] hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:ring-[#171717] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-busy={isExporting}
            >
              {isExporting ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
                  <span>Export</span>
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={isRegenerating || isExporting}
              className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating || isExporting
                  ? "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] dark:border-[#333333] dark:bg-[#171717] dark:text-[#666666]"
                  : "border-[#e5e5e5] bg-white text-[#ef4444] hover:border-[#fca5a5] hover:bg-[#fef2f2] focus:ring-[#ef4444] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-[#f87171] dark:hover:border-[#7f1d1d] dark:hover:bg-[#450a0a] dark:focus:ring-[#f87171]"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* Markdown Preview */}
        <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] sm:p-12">
          <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[550] prose-headings:tracking-[-0.02em] prose-h1:text-[32px] prose-h1:leading-[1.2] prose-h2:text-[24px] prose-h2:leading-[1.3] prose-h3:text-[18px] prose-h3:leading-[1.4] prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-[#525252] prose-li:text-[15px] prose-li:leading-[1.7] prose-li:text-[#525252] prose-strong:font-[550] prose-strong:text-[#171717] prose-code:rounded-[4px] prose-code:bg-[#fafafa] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-[450] prose-code:text-[14px] prose-code:text-[#171717] prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-[6px] prose-pre:border prose-pre:border-[#e5e5e5] prose-pre:bg-[#fafafa] dark:prose-p:text-[#a3a3a3] dark:prose-li:text-[#a3a3a3] dark:prose-strong:text-white dark:prose-code:bg-[#171717] dark:prose-code:text-white dark:prose-pre:border-[#333333] dark:prose-pre:bg-[#171717]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {paper.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
