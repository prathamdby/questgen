"use client";

import type { PaperMetadata } from "@/lib/storage";

interface StatusBadgeProps {
  status: PaperMetadata["status"];
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusStyles = (status: PaperMetadata["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]";
      case "in_progress":
        return "bg-[#fef08a] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]";
      default:
        return "";
    }
  };

  const sizeClasses =
    size === "sm"
      ? "rounded-[4px] px-1.5 py-0.5 text-[11px] font-[500]"
      : "rounded-[4px] px-2 py-0.5 text-[12px] font-[500]";

  return (
    <span className={`${sizeClasses} ${getStatusStyles(status)}`}>
      {status === "completed" ? "Completed" : "In Progress"}
    </span>
  );
}

