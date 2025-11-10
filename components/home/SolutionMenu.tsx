"use client";

import { MoreVertical, FileText, Trash2, Loader2 } from "lucide-react";

interface SolutionMenuProps {
  isOpen: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onViewPaper: () => void;
  onDelete: () => void;
  menuRef:
    | React.RefObject<HTMLDivElement | null>
    | ((el: HTMLDivElement | null) => void);
}

export function SolutionMenu({
  isOpen,
  isDeleting,
  onToggle,
  onViewPaper,
  onDelete,
  menuRef,
}: SolutionMenuProps) {
  const refCallback = typeof menuRef === "function" ? menuRef : undefined;
  const refObject = typeof menuRef === "function" ? undefined : menuRef;

  return (
    <div
      className="relative"
      data-menu-container
      ref={refCallback || refObject}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-[#737373] transition-all duration-150 hover:bg-[#fafafa] hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:hover:bg-[#171717] dark:hover:text-white dark:focus:ring-white"
        aria-label="Solution options"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-0 top-8 z-10 w-[192px] rounded-[6px] border border-[#e5e5e5] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewPaper();
            }}
            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#171717] transition-all duration-150 hover:bg-[#fafafa] dark:text-white dark:hover:bg-[#171717]"
          >
            <FileText className="h-4 w-4 text-[#737373]" aria-hidden="true" />
            <span className="font-[500]">Open linked paper</span>
          </button>
          <div className="my-1 h-px bg-[#e5e5e5] dark:bg-[#333333]" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] transition-all duration-150 ${
              isDeleting
                ? "cursor-not-allowed bg-[#f5f5f5] text-[#a3a3a3] dark:bg-[#171717] dark:text-[#666666]"
                : "text-[#ef4444] hover:bg-[#fef2f2] dark:text-[#f87171] dark:hover:bg-[#450a0a]"
            }`}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="font-[500]">
              {isDeleting ? "Removing..." : "Delete solution"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
