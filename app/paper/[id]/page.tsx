"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getPaper,
  getPaperContent,
  deletePaper,
  completePaper,
  setPaperStatus,
} from "@/lib/storage";
import { regenerateQuestionPaper } from "@/lib/openrouter-client";
import { PaperStatusBadge } from "@/components/paper/PaperStatusBadge";
import { MetadataGrid } from "@/components/paper/MetadataGrid";
import { SourceFilesSection } from "@/components/paper/SourceFilesSection";
import { ActionButtons } from "@/components/paper/ActionButtons";
import { RegenerationPanel } from "@/components/paper/RegenerationPanel";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { PaperNotFound } from "@/components/paper/PaperNotFound";

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

function PaperContent({ id }: { id: string }) {
  const router = useRouter();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenPanelOpen, setIsRegenPanelOpen] = useState(false);
  const [regenNotes, setRegenNotes] = useState("");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const regenPanelId = "paper-regenerate-panel";

  useEffect(() => {
    const metadata = getPaper(id);
    let content = getPaperContent(id);

    if (metadata && content) {
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
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
        "Are you sure you want to delete this paper? This action cannot be undone.",
      )
    ) {
      deletePaper(paper.id);
      router.push("/home");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <Loader2
            className="mx-auto h-8 w-8 animate-spin text-[#737373]"
            aria-hidden="true"
          />
          <p className="mt-4 text-[15px] text-[#737373]">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return <PaperNotFound />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        <Link
          href="/home"
          className="group mb-8 inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Back to papers</span>
        </Link>

        <header className="mb-12">
          <PaperStatusBadge status={paper.status} createdAt={paper.createdAt} />

          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {paper.title}
          </h1>

          <MetadataGrid
            pattern={paper.pattern}
            duration={paper.duration}
            totalMarks={paper.totalMarks}
          />

          {paper.files && paper.files.length > 0 && (
            <SourceFilesSection
              files={paper.files}
              isExpanded={notesExpanded}
              onToggle={() => setNotesExpanded(!notesExpanded)}
            />
          )}

          <ActionButtons
            onRegenerate={handleRegenButtonClick}
            onExport={handleExport}
            onDelete={handleDelete}
            isRegenerating={isRegenerating}
            isExporting={isExporting}
            disabled={false}
          />

          <RegenerationPanel
            isOpen={isRegenPanelOpen}
            notes={regenNotes}
            onNotesChange={setRegenNotes}
            onRegenerate={triggerRegeneration}
            onSkipInstructions={() => triggerRegeneration("")}
            isRegenerating={isRegenerating}
            panelId={regenPanelId}
          />
        </header>

        <MarkdownPreview content={paper.content} />
      </div>
    </div>
  );
}

function PaperContentWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PaperContent id={id} />;
}

export default function PaperPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
          <div className="text-center">
            <Loader2
              className="mx-auto h-8 w-8 animate-spin text-[#737373]"
              aria-hidden="true"
            />
            <p className="mt-4 text-[15px] text-[#737373]">Loading paper...</p>
          </div>
        </div>
      }
    >
      <PaperContentWrapper params={params} />
    </Suspense>
  );
}
