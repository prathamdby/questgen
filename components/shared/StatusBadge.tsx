"use client";

interface StatusBadgeProps {
  status: "completed" | "in_progress";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusStyles = (status: "completed" | "in_progress") => {
    switch (status) {
      case "completed":
        return "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]";
      case "in_progress":
        return "bg-[#fef08a] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]";
      default:
        return "";
    }
  };

  const getStatusText = (status: "completed" | "in_progress") => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
    }
  };

  const sizeClasses =
    size === "sm"
      ? "rounded-[6px] px-1.5 py-0.5 text-[11px] font-[600] tracking-[-0.01em]"
      : "rounded-[6px] px-2 py-0.5 text-[12px] font-[600] tracking-[-0.01em]";

  return (
    <span
      className={`${sizeClasses} ${getStatusStyles(status)}`}
      title={`Paper is ${getStatusText(status).toLowerCase()}`}
    >
      {getStatusText(status)}
    </span>
  );
}
