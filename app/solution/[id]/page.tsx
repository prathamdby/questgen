"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import {
  exportSolutionToPDF,
  type SolutionData,
} from "@/lib/pdf-export-client";
import { useSolution, useDeleteSolution } from "@/lib/queries/papers";
import { PaperStatusBadge } from "@/components/paper/PaperStatusBadge";
import { MetadataGrid } from "@/components/paper/MetadataGrid";
import { SourceFilesSection } from "@/components/paper/SourceFilesSection";
import { SolutionActionButtons } from "@/components/paper/SolutionActionButtons";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";
import { PaperNotFound } from "@/components/paper/PaperNotFound";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

function SolutionContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data, isPending, error } = useSolution(id);
  const deleteSolution = useDeleteSolution();
  const queryClient = useQueryClient();

  const [isExporting, setIsExporting] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const solution = data?.solution || null;
  const isLoading = isPending && !solution;
  const isDeleting = deleteSolution.isPending;

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/signin");
      return;
    }
  }, [session, sessionPending, router]);

  const handleExport = async () => {
    if (!solution) return;

    setIsExporting(true);

    try {
      const solutionData: SolutionData = {
        paperTitle: solution.paper.title,
        pattern: solution.paper.pattern,
        duration: solution.paper.duration,
        totalMarks: solution.paper.totalMarks,
        content: solution.content,
        createdAt: solution.createdAt,
      };

      await exportSolutionToPDF(solutionData);
      toast.success("Solution exported successfully");
    } catch (error) {
      toast.error("Unable to export solution", {
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
    if (!solution) return;

    if (
      confirm(
        "Are you sure you want to delete this solution? This action cannot be undone.",
      )
    ) {
      deleteSolution.mutate(solution.id, {
        onSuccess: () => {
          router.push("/home");
        },
      });
    }
  };

  if (isLoading) {
    return <PaperDetailSkeleton />;
  }

  if (error) {
    return (
      <PaperNotFound
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["solution", id] })
        }
      />
    );
  }

  if (!solution) {
    return <PaperNotFound />;
  }

  const sourceFiles: UploadedFile[] =
    solution.paper.files?.map((file) => ({
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
          <PaperStatusBadge
            status={solution.status}
            createdAt={solution.createdAt}
          />

          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {solution.paper.title}
          </h1>

          <MetadataGrid
            pattern={solution.paper.pattern}
            duration={solution.paper.duration}
            totalMarks={solution.paper.totalMarks}
          />

          {sourceFiles.length > 0 && (
            <SourceFilesSection
              files={sourceFiles}
              isExpanded={notesExpanded}
              onToggle={() => setNotesExpanded((prev) => !prev)}
            />
          )}

          <Link
            href={`/paper/${solution.paperId}`}
            className="group mb-6 flex h-[44px] items-center justify-center gap-2 rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
            style={{ touchAction: "manipulation" }}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>View question paper</span>
            <ExternalLink
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>

          <SolutionActionButtons
            onExport={handleExport}
            onDelete={handleDelete}
            isExporting={isExporting}
            isDeleting={isDeleting}
          />
        </header>

        <MarkdownPreview content={solution.content} />
      </div>
    </div>
  );
}

function SolutionContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SolutionContent id={id} />;
}

export default function SolutionPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PaperDetailSkeleton />}>
      <SolutionContentWrapper params={params} />
    </Suspense>
  );
}
