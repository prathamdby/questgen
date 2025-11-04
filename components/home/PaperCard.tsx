"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
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
}

interface PaperCardProps {
  paper: QuestionPaper;
  isMenuOpen: boolean;
  isExporting: boolean;
  onMenuToggle: () => void;
  onExport: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export function PaperCard({
  paper,
  isMenuOpen,
  isExporting,
  onMenuToggle,
  onExport,
  onDuplicate,
  onDelete,
  menuRef,
}: PaperCardProps) {
  return (
    <Link
      href={`/paper/${paper.id}`}
      className="group block rounded-[6px] border border-[#e5e5e5] bg-white p-5 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
    >
      {/* Paper Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-[500] text-[#171717] dark:text-white">
            {paper.title}
          </h3>
          <p className="mt-1 text-[13px] text-[#737373] line-clamp-1">
            {paper.pattern}
          </p>
        </div>
        <PaperMenu
          isOpen={isMenuOpen}
          isExporting={isExporting}
          onToggle={onMenuToggle}
          onExport={onExport}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          menuRef={menuRef}
        />
      </div>

      {/* Paper Metadata */}
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <StatusBadge status={paper.status} />
        <span className="flex items-center gap-1.5 text-[#737373]">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {paper.duration}
        </span>
        <span className="flex items-center gap-1.5 tabular-nums text-[#737373]">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {paper.totalMarks} marks
        </span>
      </div>

      {/* Paper Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#f5f5f5] pt-4 dark:border-[#262626]">
        <span className="text-[12px] tabular-nums text-[#a3a3a3]">
          {formatDateShort(paper.createdAt)}
        </span>
        <span className="flex items-center gap-1 text-[13px] font-[500] text-[#737373] transition-colors group-hover:text-[#171717] dark:group-hover:text-white">
          View details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

