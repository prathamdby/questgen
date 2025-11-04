"use client";

import { Calendar, Clock, FileText } from "lucide-react";

interface MetadataGridProps {
  pattern: string;
  duration: string;
  totalMarks: number;
}

export function MetadataGrid({
  pattern,
  duration,
  totalMarks,
}: MetadataGridProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <div className="min-w-0 rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
        <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Pattern
        </div>
        <p
          className="min-w-0 truncate text-[14px] text-[#171717] dark:text-white"
          title={pattern}
        >
          {pattern}
        </p>
      </div>

      <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
        <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Duration
        </div>
        <p className="text-[14px] text-[#171717] dark:text-white">{duration}</p>
      </div>

      <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
        <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Total Marks
        </div>
        <p className="text-[14px] tabular-nums text-[#171717] dark:text-white">
          {totalMarks}
        </p>
      </div>
    </div>
  );
}
