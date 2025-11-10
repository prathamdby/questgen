"use client";

import { Download, Trash2, Loader2 } from "lucide-react";

interface SolutionActionButtonsProps {
  onExport: () => void;
  onDelete: () => void;
  isExporting: boolean;
  isDeleting: boolean;
}

export function SolutionActionButtons({
  onExport,
  onDelete,
  isExporting,
  isDeleting,
}: SolutionActionButtonsProps) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <button
        onClick={onExport}
        disabled={isExporting || isDeleting}
        className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
          isExporting || isDeleting
            ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
            : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
        }`}
        style={{ touchAction: "manipulation" }}
        aria-busy={isExporting}
      >
        {isExporting ? (
          <>
            <Loader2
              className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span>Export</span>
          </>
        )}
      </button>

      <button
        onClick={onDelete}
        disabled={isExporting || isDeleting}
        className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
          isExporting || isDeleting
            ? "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] dark:border-[#333333] dark:bg-[#171717] dark:text-[#666666]"
            : "border-[#e5e5e5] bg-white text-[#ef4444] hover:border-[#fca5a5] hover:bg-[#fef2f2] focus:ring-[#ef4444] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-[#f87171] dark:hover:border-[#7f1d1d] dark:hover:bg-[#450a0a] dark:focus:ring-[#f87171]"
        }`}
        style={{ touchAction: "manipulation" }}
        aria-busy={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2
              className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Delete</span>
          </>
        )}
      </button>
    </div>
  );
}
