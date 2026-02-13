"use client";

import { Clock, Hash } from "lucide-react";
import type { RecentPattern } from "@/lib/queries/types";

interface RecentPatternsProps {
  patterns: RecentPattern[];
  onSelect: (pattern: string, duration: string, totalMarks: string) => void;
}

export function RecentPatterns({ patterns, onSelect }: RecentPatternsProps) {
  if (patterns.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-[12px] font-[500] uppercase tracking-[0.05em] text-[#737373] dark:text-[#737373]">
        Recent
      </p>
      <div className="flex flex-col gap-1.5">
        {patterns.map((p, i) => (
          <button
            key={`${p.title}-${i}`}
            type="button"
            onClick={() => onSelect(p.pattern, p.duration, p.totalMarks.toString())}
            className="group flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-2.5 text-left transition-all duration-150 hover:border-[#d4d4d4] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
          >
            <span className="min-w-0 flex-1 truncate text-[13px] font-[500] text-[#171717] dark:text-white">
              {p.title}
            </span>
            <div className="ml-3 flex flex-shrink-0 items-center gap-3 text-[12px] text-[#737373]">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {p.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3 w-3" aria-hidden="true" />
                {p.totalMarks}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
