"use client";

import { Loader2, ArrowRight } from "lucide-react";

interface GenerateButtonProps {
  isGenerating: boolean;
  disabled?: boolean;
}

export function GenerateButton({
  isGenerating,
  disabled = false,
}: GenerateButtonProps) {
  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={isGenerating || disabled}
        className={`group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] px-6 text-[15px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isGenerating || disabled
            ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
            : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
        }`}
        style={{ touchAction: "manipulation" }}
        aria-busy={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Generating Quest...</span>
          </>
        ) : (
          <>
            <span>Generate Quest</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {/* Loading Feedback */}
      {isGenerating && (
        <p className="mt-3 text-center text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
          This may take a few moments. Please don't close this page.
        </p>
      )}
    </div>
  );
}
