"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { PaperStatusBadge } from "@/components/paper/PaperStatusBadge";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { PaperDetailSkeleton } from "@/components/paper/PaperDetailSkeleton";
import { PaperNotFound } from "@/components/paper/PaperNotFound";

interface SolutionDetail {
  id: string;
  paperId: string;
  content: string;
  status: "completed" | "in_progress";
  createdAt: string;
  updatedAt: string;
  paper: {
    id: string;
    title: string;
    pattern: string;
    duration: string;
    totalMarks: number;
    createdAt: string;
  };
}

function SolutionContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
      return;
    }

    if (session) {
      fetchSolution();
    }
  }, [session, isPending, id, router]);

  const fetchSolution = async () => {
    try {
      const response = await fetch(`/api/solutions/${id}`);
      const data = await response.json();

      if (!data.solution) {
        throw new Error("Solution not found");
      }

      setSolution(data.solution);
    } catch (error) {
      // Silent fail - component will show not found state
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!solution) return;

    if (
      confirm(
        "Are you sure you want to delete this solution? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/solutions/${solution.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/home");
        } else {
          throw new Error("Failed to delete solution");
        }
      } catch (error) {
        toast.error("Failed to delete solution");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return <PaperDetailSkeleton />;
  }

  if (!solution) {
    return <PaperNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] to-[#f0f9ff] dark:from-[#05080d] dark:to-[#060a10]">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        <Link
          href="/home"
          className="group mb-8 inline-flex items-center gap-2 text-[14px] font-[500] text-[#2563eb] transition-colors hover:text-[#1d4ed8] dark:text-[#93c5fd] dark:hover:text-[#bfdbfe]"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Back to home</span>
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <FileText
              className="h-5 w-5 flex-shrink-0 text-[#3b82f6] dark:text-[#60a5fa]"
              aria-hidden="true"
            />
            <span className="text-[13px] font-[600] uppercase tracking-[0.06em] text-[#3b82f6] dark:text-[#60a5fa]">
              Solution
            </span>
          </div>

          <PaperStatusBadge
            status={solution.status}
            createdAt={solution.createdAt}
          />

          <h1 className="mb-8 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {solution.paper.title}
          </h1>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[6px] border border-[#dbeafe] bg-white p-4 dark:border-[#1e3a8a] dark:bg-[#0a1628]">
              <p className="text-[12px] font-[600] uppercase tracking-[0.05em] text-[#737373] dark:text-[#8c8c8c]">
                Pattern
              </p>
              <p className="mt-1.5 text-[14px] font-[500] text-[#171717] dark:text-white">
                {solution.paper.pattern}
              </p>
            </div>
            <div className="rounded-[6px] border border-[#dbeafe] bg-white p-4 dark:border-[#1e3a8a] dark:bg-[#0a1628]">
              <p className="text-[12px] font-[600] uppercase tracking-[0.05em] text-[#737373] dark:text-[#8c8c8c]">
                Duration
              </p>
              <p className="mt-1.5 text-[14px] font-[500] text-[#171717] dark:text-white">
                {solution.paper.duration}
              </p>
            </div>
            <div className="rounded-[6px] border border-[#dbeafe] bg-white p-4 dark:border-[#1e3a8a] dark:bg-[#0a1628]">
              <p className="text-[12px] font-[600] uppercase tracking-[0.05em] text-[#737373] dark:text-[#8c8c8c]">
                Total Marks
              </p>
              <p className="mt-1.5 text-[14px] font-[500] tabular-nums text-[#171717] dark:text-white">
                {solution.paper.totalMarks}
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href={`/paper/${solution.paperId}`}
              className="group flex h-[44px] items-center gap-2 rounded-[6px] border-2 border-[#3b82f6] bg-[#3b82f6] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:border-[#2563eb] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:ring-offset-2 active:scale-[0.98] dark:border-[#60a5fa] dark:bg-[#60a5fa] dark:text-[#0a0a0a] dark:hover:border-[#93c5fd] dark:hover:bg-[#93c5fd] dark:focus:ring-[#93c5fd]"
              style={{ touchAction: "manipulation" }}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>View question paper</span>
              <ExternalLink
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-[44px] items-center gap-2 rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#ef4444] transition-all duration-150 hover:border-[#fee2e2] hover:bg-[#fee2e2] focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#333333] dark:bg-[#0a0a0a] dark:text-[#f87171] dark:hover:border-[#7f1d1d] dark:hover:bg-[#450a0a] dark:focus:ring-[#f87171]"
              style={{ touchAction: "manipulation" }}
            >
              {isDeleting ? "Deleting..." : "Delete solution"}
            </button>
          </div>
        </header>

        <div className="rounded-[8px] border border-[#dbeafe] bg-white p-8 shadow-[0_2px_8px_rgba(59,130,246,0.08)] dark:border-[#1e3a8a] dark:bg-[#0a1628] dark:shadow-[0_2px_8px_rgba(30,64,175,0.4)] sm:rounded-[6px] sm:p-12">
          <MarkdownPreview content={solution.content} />
        </div>
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
