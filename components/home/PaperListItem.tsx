"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileCheck, FileText } from "lucide-react";
import type { PaperListItem as PaperListItemType } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateShort } from "@/lib/format-utils";
import { PaperMenu } from "./PaperMenu";

interface PaperListItemProps {
  paper: PaperListItemType;
  isMenuOpen: boolean;
  isExporting: boolean;
  onMenuToggle: () => void;
  onExport: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onOpenSolution?: () => void;
  menuRef:
    | ((el: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>;
}

export function PaperListItem({
  paper,
  isMenuOpen,
  isExporting,
  onMenuToggle,
  onExport,
  onDuplicate,
  onDelete,
  onOpenSolution,
  menuRef,
}: PaperListItemProps) {
  return (
    <Link
      href={`/paper/${paper.id}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.closest("[data-menu-container]") ||
          target.closest('button[aria-label="Paper options"]') ||
          target.closest("button[data-solution-button]")
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
              {paper.title}
            </h3>
            <StatusBadge status={paper.status} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-[#737373]">
            {paper.pattern}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 text-[13px] text-[#737373]">
          <span className="hidden items-center gap-1.5 sm:flex">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {paper.duration}
          </span>
          <span className="hidden items-center gap-1.5 tabular-nums sm:flex">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {paper.totalMarks} marks
          </span>
          {paper.solution && (
            <button
              type="button"
              data-solution-button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenSolution?.();
              }}
              className="hidden items-center gap-1.5 text-[#737373] transition-colors hover:text-[#171717] focus:outline-none focus:underline dark:hover:text-white sm:flex"
            >
              <FileCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Solution
            </button>
          )}
          <span className="tabular-nums text-[12px] text-[#a3a3a3]">
            {formatDateShort(paper.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1 text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white sm:flex">
          View <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <PaperMenu
          isOpen={isMenuOpen}
          isExporting={isExporting}
          onToggle={onMenuToggle}
          onExport={onExport}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          hasSolution={!!paper.solution}
          solutionId={paper.solution?.id}
          onOpenSolution={paper.solution ? onOpenSolution : undefined}
          menuRef={menuRef}
        />
      </div>
    </Link>
  );
}
