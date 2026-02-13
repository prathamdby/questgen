interface StatusBadgeProps {
  status: "completed" | "in_progress";
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<StatusBadgeProps["status"], string> = {
  completed:
    "bg-[oklch(0.982_0.018_155.826)] text-[oklch(0.448_0.119_151.328)] dark:bg-[oklch(0.15_0.05_150)] dark:text-[oklch(0.7_0.15_150)]",
  in_progress:
    "bg-[oklch(0.943_0.109_102.126)] text-[oklch(0.412_0.109_65.638)] dark:bg-[oklch(0.15_0.08_100)] dark:text-[oklch(0.75_0.12_100)]",
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
