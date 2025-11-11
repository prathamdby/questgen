"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, FileCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { exportToPDF, type PaperData } from "@/lib/pdf-export-client";
import {
  usePaper,
  useRegeneratePaper,
  useDeletePaper,
} from "@/lib/queries/papers";
import { PaperStatusBadge } from "@/components/paper/PaperStatusBadge";
import { MetadataGrid } from "@/components/paper/MetadataGrid";
import { SourceFilesSection } from "@/components/paper/SourceFilesSection";
import { ActionButtons } from "@/components/paper/ActionButtons";
import { RegenerationPanel } from "@/components/paper/RegenerationPanel";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";
import { PaperNotFound } from "@/components/paper/PaperNotFound";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

function PaperContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data, isPending, error } = usePaper(id);
  const regeneratePaper = useRegeneratePaper();
  const deletePaper = useDeletePaper();
  const queryClient = useQueryClient();

  const [notesExpanded, setNotesExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenPanelOpen, setIsRegenPanelOpen] = useState(false);
  const [regenNotes, setRegenNotes] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const regenPanelId = "paper-regenerate-panel";

  const paper = data?.paper || null;
  const isLoading = isPending && !paper;
  const isRegenerating = regeneratePaper.isPending;

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/signin");
      return;
    }
  }, [session, sessionPending, router]);

  const handleRegenButtonClick = () => {
    if (isRegenerating) return;
    setIsRegenPanelOpen((prev) => !prev);
  };

  const triggerRegeneration = (notes: string) => {
    if (!paper || isRegenerating) return;

    regeneratePaper.mutate(
      { paperId: paper.id, instructions: notes },
      {
        onSuccess: () => {
          setRegenNotes("");
          setIsRegenPanelOpen(false);
        },
      },
    );
  };

  const handleExport = async () => {
    if (!paper) return;

    setIsExporting(true);

    try {
      if (!paper.content) {
        throw new Error("Paper content is unavailable");
      }

      const paperData: PaperData = {
        title: paper.title,
        pattern: paper.pattern,
        duration: paper.duration,
        totalMarks: paper.totalMarks,
        content: paper.content,
        createdAt: paper.createdAt,
      };

      await exportToPDF(paperData);
      toast.success("Paper exported successfully");
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

  const handleDelete = () => {
    if (!paper) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!paper) return;
    deletePaper.mutate(paper.id, {
      onSuccess: () => {
        router.push("/home");
      },
    });
  };

  if (isLoading) {
    return <PaperDetailSkeleton />;
  }

  if (error) {
    return (
      <PaperNotFound
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["paper", id] })
        }
      />
    );
  }

  if (!paper) {
    return <PaperNotFound />;
  }

  const files: UploadedFile[] =
    paper.files?.map((file) => ({
      name: file.name,
      type: file.mimeType ?? "",
      size: file.size,
    })) ?? [];

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
          <span>Back to home</span>
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

          {files.length > 0 && (
            <SourceFilesSection
              files={files}
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

        <MarkdownPreview content={paper.content ?? ""} />
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Paper"
        description="Are you sure you want to delete this paper? This action cannot be undone."
        confirmLabel="Delete Paper"
        onConfirm={handleConfirmDelete}
        isLoading={deletePaper.isPending}
      />
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
