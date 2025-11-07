"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
        <FileText className="h-10 w-10 text-[#737373]" aria-hidden="true" />
      </div>
      <h3 className="text-[20px] font-[500] text-[#171717] dark:text-white">
        No quests yet
      </h3>
      <p className="mt-2 text-[15px] text-[#737373]">
        Create your first quest to get started
      </p>
      <Link
        href="/generate"
        className="mt-6 flex h-[44px] items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
        style={{ touchAction: "manipulation" }}
      >
        Create your first paper
      </Link>
    </div>
  );
}
