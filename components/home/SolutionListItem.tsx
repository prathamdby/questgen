"use client";

import Link from "next/link";
import { ArrowRight, FileCheck, FileText } from "lucide-react";
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
      className="group flex items-center justify-between gap-4 rounded-[6px] border-2 border-[#dbeafe] bg-gradient-to-r from-[#eff6ff] to-[#f0f9ff] px-4 py-3 transition-all duration-150 hover:border-[#93c5fd] dark:border-[#1e3a8a] dark:from-[#0a1628] dark:to-[#0c1a2e] dark:hover:border-[#1e40af]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <FileCheck
              className="h-3.5 w-3.5 flex-shrink-0 text-[#3b82f6] dark:text-[#60a5fa]"
              aria-hidden="true"
            />
            <h3 className="truncate text-[15px] font-[500] text-[#171717] dark:text-white">
              {solution.paper.title}
            </h3>
            <StatusBadge status={solution.status} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-[#595959] dark:text-[#a3a3a3]">
            {solution.paper.pattern}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 text-[13px] text-[#595959] dark:text-[#a3a3a3]">
          <span className="hidden items-center gap-1.5 tabular-nums sm:flex">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {solution.paper.totalMarks} marks
          </span>
          <span className="tabular-nums text-[12px] text-[#737373] dark:text-[#8c8c8c]">
            {formatDateShort(solution.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1 text-[13px] font-[500] text-[#3b82f6] transition-colors group-hover:text-[#2563eb] dark:text-[#60a5fa] dark:group-hover:text-[#93c5fd] sm:flex">
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
