"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, FileCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { exportToPDF, type PaperData } from "@/lib/pdf-export-client";
import { PaperStatusBadge } from "@/components/paper/PaperStatusBadge";
import { MetadataGrid } from "@/components/paper/MetadataGrid";
import { SourceFilesSection } from "@/components/paper/SourceFilesSection";
import { ActionButtons } from "@/components/paper/ActionButtons";
import { RegenerationPanel } from "@/components/paper/RegenerationPanel";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";
import { PaperNotFound } from "@/components/paper/PaperNotFound";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

interface PaperFile {
  name: string;
  mimeType: string;
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
  solution?: {
    id: string;
  } | null;
}

function PaperContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenPanelOpen, setIsRegenPanelOpen] = useState(false);
  const [regenNotes, setRegenNotes] = useState("");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const regenPanelId = "paper-regenerate-panel";

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
      return;
    }

    if (session) {
      fetchPaper();
    }
  }, [session, isPending, id, router]);

  const fetchPaper = async () => {
    try {
      const response = await fetch(`/api/papers/${id}`);
      const data = await response.json();

      if (!data.paper) {
        throw new Error("Paper not found");
      }

      setPaper({
        id: data.paper.id,
        title: data.paper.title,
        pattern: data.paper.pattern,
        duration: data.paper.duration,
        totalMarks: data.paper.totalMarks,
        createdAt: data.paper.createdAt,
        updatedAt: data.paper.updatedAt,
        status: data.paper.status,
        files: data.paper.files?.map((f: PaperFile) => ({
          name: f.name,
          type: f.mimeType,
          size: f.size,
        })),
        content: data.paper.content,
        solution: data.paper.solution ?? null,
      });
    } catch (error) {
      // Silent fail - component will show not found state
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenButtonClick = () => {
    if (isRegenerating) return;
    setIsRegenPanelOpen((prev) => !prev);
  };

  const triggerRegeneration = async (notes: string) => {
    if (!paper || isRegenerating) return;

    const trimmedNotes = notes.trim();

    setIsRegenerating(true);
    setPaper((prev) => (prev ? { ...prev, status: "in_progress" } : prev));

    try {
      const response = await fetch("/api/papers/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: paper.id,
          instructions: trimmedNotes,
        }),
      });

      if (response.status === 429) {
        toast.error("Rate limit exceeded", {
          description:
            "You can regenerate 2 papers per minute. Please wait before trying again.",
        });
        return;
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setPaper((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: result.content,
          status: "completed",
          updatedAt: result.updatedAt,
        };
      });

      setRegenNotes("");
      setIsRegenPanelOpen(false);
    } catch (error) {
      toast.error("Regeneration failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setPaper((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleExport = async () => {
    if (!paper) return;

    setIsExporting(true);

    try {
      const paperData: PaperData = {
        title: paper.title,
        pattern: paper.pattern,
        duration: paper.duration,
        totalMarks: paper.totalMarks,
        content: paper.content,
        createdAt: paper.createdAt,
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
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!paper) return;

    if (
      confirm(
        "Are you sure you want to delete this paper? This action cannot be undone.",
      )
    ) {
      try {
        const response = await fetch(`/api/papers/${paper.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/home");
        } else {
          throw new Error("Failed to delete paper");
        }
      } catch (error) {
        toast.error("Failed to delete paper");
      }
    }
  };

  if (isLoading) {
    return <PaperDetailSkeleton />;
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

          {paper.solution && (
            <Link
              href={`/solution/${paper.solution.id}`}
              className="group mb-6 flex h-[44px] items-center justify-center gap-2 rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
              style={{ touchAction: "manipulation" }}
            >
              <FileCheck className="h-4 w-4" aria-hidden="true" />
              <span>View companion solution</span>
              <ExternalLink
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
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
    <Suspense fallback={<PaperDetailSkeleton />}>
      <PaperContentWrapper params={params} />
    </Suspense>
  );
}
