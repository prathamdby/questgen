"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
  Download,
  Trash2,
  RefreshCw,
  Loader2,
  ChevronDown,
  FileType,
  Image as ImageIcon,
  File,
} from "lucide-react";
import {
  getPaper,
  getPaperContent,
  deletePaper,
  completePaper,
  setPaperStatus,
} from "@/lib/storage";
import { regenerateQuestionPaper } from "@/lib/openrouter-client";

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
  updatedAt: string;
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
  const [isRegenPanelOpen, setIsRegenPanelOpen] = useState(false);
  const [regenNotes, setRegenNotes] = useState("");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const regenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const regenPanelId = "paper-regenerate-panel";

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
        updatedAt: metadata.updatedAt,
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

  useEffect(() => {
    if (isRegenPanelOpen && regenTextareaRef.current) {
      const textarea = regenTextareaRef.current;
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isRegenPanelOpen]);

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
          <FileText className="h-4 w-4 text-[#ef4444]" aria-hidden="true" />
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
          <ImageIcon className="h-4 w-4 text-[#8b5cf6]" aria-hidden="true" />
        );
      case "docx":
      case "doc":
        return (
          <FileText className="h-4 w-4 text-[#2b579a]" aria-hidden="true" />
        );
      case "md":
      case "txt":
        return (
          <FileText className="h-4 w-4 text-[#737373]" aria-hidden="true" />
        );
      default:
        return (
          <File className="h-4 w-4 text-[#737373]" aria-hidden="true" />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#737373]" aria-hidden="true" />
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
              <FileText className="h-10 w-10 text-[#737373]" aria-hidden="true" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-10">
            <h1 className="font-sans text-[32px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
              This paper went missing
            </h1>
            <p className="mt-4 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              {
                "The paper you\u2019re looking for doesn\u2019t exist or may have been deleted. Let\u2019s get you back on track."
              }
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
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
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

  const handleRegenButtonClick = () => {
    if (isRegenerating) return;
    setIsRegenPanelOpen((prev) => !prev);
  };

  const triggerRegeneration = async (notes: string) => {
    if (!paper || isRegenerating) return;

    const trimmedNotes = notes.trim();

    setIsRegenerating(true);
    setPaper((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
    setPaperStatus(paper.id, "in_progress");

    try {
      const result = await regenerateQuestionPaper({
        paperName: paper.title,
        paperPattern: paper.pattern,
        duration: paper.duration,
        totalMarks: String(paper.totalMarks),
        previousContent: paper.content,
        instructions: trimmedNotes.length > 0 ? trimmedNotes : undefined,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const updatedMetadata = completePaper(paper.id, result.content);

      setPaper((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: result.content,
          status: "completed",
          updatedAt: updatedMetadata?.updatedAt ?? prev.updatedAt,
        };
      });

      setRegenNotes("");
      setIsRegenPanelOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Unable to regenerate your paper", {
        description: message.includes("Primary model")
          ? "Both AI models are currently overloaded. Please try again in a few moments."
          : message,
      });
      setPaper((prev) => (prev ? { ...prev, status: "completed" } : prev));
      setPaperStatus(paper.id, "completed");
    } finally {
      setIsRegenerating(false);
    }
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
      toast.error("Unable to export your paper", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
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
          <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
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
            <div className="min-w-0 rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Pattern
              </div>
              <p
                className="min-w-0 truncate text-[14px] text-[#171717] dark:text-white"
                title={paper.pattern}
              >
                {paper.pattern}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Duration
              </div>
              <p className="text-[14px] text-[#171717] dark:text-white">
                {paper.duration}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <FileText className="h-4 w-4" aria-hidden="true" />
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
                  <FileText className="h-4 w-4 text-[#737373]" aria-hidden="true" />
                  <span className="text-[14px] font-[500] text-[#171717] dark:text-white">
                    Source Files ({paper.files.length})
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#737373] transition-transform duration-200 ${
                    notesExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
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
              onClick={handleRegenButtonClick}
              disabled={isRegenerating}
              className={`group flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating
                  ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
                  : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-busy={isRegenerating}
              aria-expanded={isRegenPanelOpen}
              aria-controls={regenPanelId}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" aria-hidden="true" />
                  <span>Regen...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" aria-hidden="true" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
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
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>

          {isRegenPanelOpen && (
            <div
              id={regenPanelId}
              className="mt-3 rounded-[8px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]"
            >
              <label
                htmlFor="regen-notes"
                className="mb-2 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
              >
                Regeneration notes
              </label>
              <textarea
                id="regen-notes"
                ref={regenTextareaRef}
                value={regenNotes}
                onChange={(e) => setRegenNotes(e.target.value)}
                rows={3}
                placeholder="Example: Tighten the Section B difficulty and add a case-study question in Section C."
                className="block w-full resize-none rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-2 text-[14px] leading-[1.5] text-[#171717] placeholder-[#a3a3a3] transition-colors duration-150 focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:focus:border-white dark:focus:ring-white"
                disabled={isRegenerating}
                aria-describedby="regen-notes-helper"
              />
              <p
                id="regen-notes-helper"
                className="mt-2 text-[12px] leading-[1.6] text-[#6d6d6d] dark:text-[#737373]"
              >
                {
                  "Keep the structure intact\u2014only describe the adjustments you want. Leave blank and use Skip instructions to rerun as-is."
                }
              </p>
              <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void triggerRegeneration(regenNotes);
                  }}
                  disabled={isRegenerating || regenNotes.trim().length === 0}
                  className={`inline-flex h-[36px] items-center justify-center rounded-[6px] px-4 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRegenerating || regenNotes.trim().length === 0
                      ? "cursor-not-allowed bg-[#e5e5e5] text-[#a3a3a3] dark:bg-[#1a1a1a] dark:text-[#4d4d4d]"
                      : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
                  }`}
                >
                  {isRegenerating
                    ? "Regenerating..."
                    : "Regenerate with instructions"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void triggerRegeneration("");
                  }}
                  disabled={isRegenerating}
                  className={`inline-flex h-[36px] items-center justify-center rounded-[6px] border px-4 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRegenerating
                      ? "cursor-not-allowed border-[#e5e5e5] text-[#a3a3a3] dark:border-[#2a2a2a] dark:text-[#4d4d4d]"
                      : "border-[#e5e5e5] text-[#171717] hover:border-[#d4d4d4] hover:bg-[#f5f5f5] focus:ring-[#171717] dark:border-[#333333] dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
                  }`}
                >
                  {isRegenerating ? "Please wait" : "Skip instructions"}
                </button>
              </div>
            </div>
          )}
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
