"use client";

import { Download, Loader2 } from "lucide-react";

interface SharedPaperActionButtonsProps {
  onExport: () => void;
  isExporting: boolean;
}

export function SharedPaperActionButtons({
  onExport,
  isExporting,
}: SharedPaperActionButtonsProps) {
  return (
    <button
      onClick={onExport}
      disabled={isExporting}
      className={`flex h-[40px] items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:h-[44px] sm:gap-2 sm:px-6 sm:text-[15px] ${
        isExporting
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
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          <span>Export</span>
        </>
      )}
    </button>
  );
}
