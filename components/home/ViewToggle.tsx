"use client";

import { LayoutGrid, List } from "lucide-react";
import type { ViewMode } from "@/lib/storage";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="mt-4 flex justify-end">
      <div className="inline-flex gap-1 rounded-[6px] border border-[#e5e5e5] bg-white p-1 dark:border-[#333333] dark:bg-[#0a0a0a]">
        <button
          onClick={() => onViewModeChange("card")}
          aria-label="Card view"
          aria-pressed={viewMode === "card"}
          className={`flex h-7 w-7 items-center justify-center rounded-[4px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white ${
            viewMode === "card"
              ? "bg-[#f5f5f5] text-[#171717] dark:bg-[#171717] dark:text-white"
              : "text-[#737373] hover:bg-[#fafafa] hover:text-[#171717] dark:hover:bg-[#171717] dark:hover:text-white"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={`flex h-7 w-7 items-center justify-center rounded-[4px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white ${
            viewMode === "list"
              ? "bg-[#f5f5f5] text-[#171717] dark:bg-[#171717] dark:text-white"
              : "text-[#737373] hover:bg-[#fafafa] hover:text-[#171717] dark:hover:bg-[#171717] dark:hover:text-white"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

