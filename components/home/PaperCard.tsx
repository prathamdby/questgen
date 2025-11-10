"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, FileCheck, FileText } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateShort } from "@/lib/format-utils";
import { PaperMenu } from "./PaperMenu";

interface QuestionPaper {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  createdAt: string;
  status: "completed" | "in_progress";
  solution?: {
    id: string;
  } | null;
}

interface PaperCardProps {
  paper: QuestionPaper;
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

export const PaperCard = React.memo(
  function PaperCard({
    paper,
    isMenuOpen,
    isExporting,
    onMenuToggle,
    onExport,
    onDuplicate,
    onDelete,
    onOpenSolution,
    menuRef,
  }: PaperCardProps) {
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
        className="group block w-full rounded-[8px] border border-[#e5e5e5] bg-white p-5 transition-all duration-150 hover:border-[#d4d4d4] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040] sm:rounded-[6px]"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] font-[500] leading-[1.3] text-[#171717] dark:text-white">
              {paper.title}
            </h3>
            <p className="mt-1.5 line-clamp-1 text-[14px] leading-[1.5] text-[#737373]">
              {paper.pattern}
            </p>
          </div>
          <div className="flex-shrink-0">
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
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2.5 text-[13px]">
          <StatusBadge status={paper.status} />
          <span className="flex items-center gap-1.5 text-[#737373]">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{paper.duration}</span>
          </span>
          <span className="flex items-center gap-1.5 tabular-nums text-[#737373]">
            <FileText
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{paper.totalMarks}&nbsp;marks</span>
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
              className="flex items-center gap-1.5 text-[#737373] transition-colors hover:text-[#171717] focus:outline-none focus:underline dark:hover:text-white"
            >
              <FileCheck
                className="h-3.5 w-3.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>Solution</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#f5f5f5] pt-4 dark:border-[#262626]">
          <span className="text-[13px] tabular-nums text-[#a3a3a3]">
            {formatDateShort(paper.createdAt)}
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
  },
  (prevProps, nextProps) => {
    // Custom comparison - ignore menuRef function
    return (
      prevProps.paper.id === nextProps.paper.id &&
      prevProps.paper.title === nextProps.paper.title &&
      prevProps.paper.pattern === nextProps.paper.pattern &&
      prevProps.paper.duration === nextProps.paper.duration &&
      prevProps.paper.totalMarks === nextProps.paper.totalMarks &&
      prevProps.paper.createdAt === nextProps.paper.createdAt &&
      prevProps.paper.status === nextProps.paper.status &&
      prevProps.paper.solution?.id === nextProps.paper.solution?.id &&
      prevProps.isMenuOpen === nextProps.isMenuOpen &&
      prevProps.isExporting === nextProps.isExporting
    );
  },
);
