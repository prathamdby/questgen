"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
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
    | ((el: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>;
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
      className="group block w-full rounded-[8px] border border-[#e5e5e5] bg-white p-5 transition-all duration-150 hover:border-[#d4d4d4] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040] sm:rounded-[6px]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-[500] leading-[1.3] text-[#171717] dark:text-white">
            {solution.paper.title}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-[14px] leading-[1.5] text-[#737373]">
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
        <span className="flex items-center gap-1.5 text-[#737373]">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{solution.paper.duration}</span>
        </span>
        <span className="flex items-center gap-1.5 tabular-nums text-[#737373]">
          <FileText className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{solution.paper.totalMarks}&nbsp;marks</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#f5f5f5] pt-4 dark:border-[#262626]">
        <span className="text-[13px] tabular-nums text-[#a3a3a3]">
          {formatDateShort(solution.createdAt)}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white">
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
