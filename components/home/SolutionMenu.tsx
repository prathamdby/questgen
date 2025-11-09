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
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] text-[#2563eb] transition-all duration-150 hover:bg-[#dbeafe] hover:text-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] dark:text-[#93c5fd] dark:hover:bg-[#1e3a8a] dark:focus:ring-[#93c5fd]"
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
          className="absolute right-0 top-8 z-10 w-[192px] rounded-[6px] border border-[#dbeafe] bg-white p-1 shadow-[0_4px_16px_rgba(59,130,246,0.16)] dark:border-[#1e3a8a] dark:bg-[#0a1628] dark:shadow-[0_4px_16px_rgba(30,64,175,0.45)]"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewPaper();
            }}
            className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] text-[#1d4ed8] transition-all duration-150 hover:bg-[#eff6ff] dark:text-[#93c5fd] dark:hover:bg-[#1e3a8a]"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span className="font-[500]">Open linked paper</span>
          </button>
          <div className="my-1 h-px bg-[#dbeafe] dark:bg-[#1e3a8a]" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] transition-all duration-150 ${
              isDeleting
                ? "cursor-not-allowed bg-[#eff6ff] text-[#93c5fd] dark:bg-[#1e3a8a] dark:text-[#93c5fd]"
                : "text-[#ef4444] hover:bg-[#fee2e2] dark:text-[#fca5a5] dark:hover:bg-[#450a0a]"
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
