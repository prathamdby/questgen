"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateShort } from "@/lib/format-utils";
import { SolutionMenu } from "./SolutionMenu";

interface SolutionListItemProps {
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

export function SolutionListItem({
  solution,
  isMenuOpen,
  isDeleting,
  onMenuToggle,
  onViewPaper,
  onDelete,
  menuRef,
}: SolutionListItemProps) {
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
      className="group flex items-center justify-between gap-4 rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-[500] text-[#171717] dark:text-white">
              {solution.paper.title}
            </h3>
            <StatusBadge status={solution.status} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-[#737373]">
            {solution.paper.pattern}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 text-[13px] text-[#737373]">
          <span className="hidden items-center gap-1.5 sm:flex">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {solution.paper.duration}
          </span>
          <span className="hidden items-center gap-1.5 tabular-nums sm:flex">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {solution.paper.totalMarks} marks
          </span>
          <span className="tabular-nums text-[12px] text-[#a3a3a3]">
            {formatDateShort(solution.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1 text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white sm:flex">
          View <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <SolutionMenu
          isOpen={isMenuOpen}
          isDeleting={isDeleting}
          onToggle={onMenuToggle}
          onViewPaper={onViewPaper}
          onDelete={onDelete}
          menuRef={menuRef}
        />
      </div>
    </Link>
  );
}
