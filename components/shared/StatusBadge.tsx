"use client";

interface StatusBadgeProps {
  status: "completed" | "in_progress";
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<StatusBadgeProps["status"], string> = {
  completed:
    "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]",
  in_progress:
    "bg-[#fef08a] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]",
};

const STATUS_TEXT: Record<StatusBadgeProps["status"], string> = {
  completed: "Completed",
  in_progress: "In Progress",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "rounded-[6px] px-1.5 py-0.5 text-[11px] font-[600] tracking-[-0.01em]"
      : "rounded-[6px] px-2 py-0.5 text-[12px] font-[600] tracking-[-0.01em]";

  const statusLabel = STATUS_TEXT[status];

  return (
    <span
      className={`${sizeClasses} ${STATUS_STYLES[status]}`}
      title={`Paper is ${statusLabel.toLowerCase()}`}
    >
      {statusLabel}
    </span>
  );
}
