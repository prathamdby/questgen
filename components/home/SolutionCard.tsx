"use client";

import Link from "next/link";
import { ArrowRight, FileCheck, FileText } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateShort } from "@/lib/format-utils";
import { SolutionMenu } from "./SolutionMenu";

interface SolutionCardProps {
  solution: {
    id: string;
    paperId: string;
    createdAt: string;
    status: "completed" | "in_progress";
    paper: {
      id: string;
      title: string;
      pattern: string;
      duration: string;
      totalMarks: number;
    };
  };
  isMenuOpen: boolean;
  isDeleting: boolean;
  onMenuToggle: () => void;
  onViewPaper: () => void;
  onDelete: () => void;
  menuRef:
    | React.RefObject<HTMLDivElement | null>
    | ((el: HTMLDivElement | null) => void);
}

export function SolutionCard({
  solution,
  isMenuOpen,
  isDeleting,
  onMenuToggle,
  onViewPaper,
  onDelete,
  menuRef,
}: SolutionCardProps) {
  return (
    <Link
      href={`/solution/${solution.id}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.closest("[data-menu-container]") ||
          target.closest('button[aria-label="Solution options"]')
        ) {
          e.preventDefault();
        }
      }}
      className="group block w-full rounded-[8px] border-2 border-[#dbeafe] bg-gradient-to-br from-[#eff6ff] to-[#f0f9ff] p-5 transition-all duration-150 hover:border-[#93c5fd] hover:shadow-[0_1px_3px_rgba(59,130,246,0.12)] dark:border-[#1e3a8a] dark:from-[#0a1628] dark:to-[#0c1a2e] dark:hover:border-[#1e40af] sm:rounded-[6px]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <FileCheck
              className="h-4 w-4 flex-shrink-0 text-[#3b82f6] dark:text-[#60a5fa]"
              aria-hidden="true"
            />
            <span className="text-[12px] font-[600] uppercase tracking-[0.05em] text-[#3b82f6] dark:text-[#60a5fa]">
              Solution
            </span>
          </div>
          <h3 className="truncate text-[16px] font-[500] leading-[1.3] text-[#171717] dark:text-white">
            {solution.paper.title}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-[14px] leading-[1.5] text-[#595959] dark:text-[#a3a3a3]">
            {solution.paper.pattern}
          </p>
        </div>
        <div className="flex-shrink-0">
          <SolutionMenu
            isOpen={isMenuOpen}
            isDeleting={isDeleting}
            onToggle={onMenuToggle}
            onViewPaper={onViewPaper}
            onDelete={onDelete}
            menuRef={menuRef}
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2.5 text-[13px]">
        <StatusBadge status={solution.status} />
        <span className="flex items-center gap-1.5 tabular-nums text-[#595959] dark:text-[#a3a3a3]">
          <FileText className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{solution.paper.totalMarks}&nbsp;marks</span>
        </span>
        <span className="flex items-center gap-1.5 text-[#737373] dark:text-[#8c8c8c]">
          <ArrowRight
            className="h-3.5 w-3.5 rotate-[-45deg]"
            aria-hidden="true"
          />
          <span>{solution.paper.duration}</span>
        </span>
      </div>

      <div className="mb-4 rounded-[6px] border border-[#bfdbfe] bg-[#eff6ff] p-3 dark:border-[#1e3a8a] dark:bg-[#10203b]">
        <p className="text-[12px] font-[600] uppercase tracking-[0.06em] text-[#1d4ed8] dark:text-[#93c5fd]">
          Linked paper
        </p>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#0f172a] dark:text-white">
          {solution.paper.title}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#dbeafe] pt-4 dark:border-[#1e3a8a]">
        <span className="text-[13px] tabular-nums text-[#737373] dark:text-[#8c8c8c]">
          {formatDateShort(solution.createdAt)}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-[500] text-[#3b82f6] transition-colors group-hover:text-[#2563eb] dark:text-[#60a5fa] dark:group-hover:text-[#93c5fd]">
          <span>View</span>
          <ArrowRight
            className="h-3.5 w-3.5 flex-shrink-0"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
