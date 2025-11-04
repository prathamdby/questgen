"use client";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateLong } from "@/lib/format-utils";

interface PaperStatusBadgeProps {
  status: "completed" | "in_progress";
  createdAt: string;
}

export function PaperStatusBadge({ status, createdAt }: PaperStatusBadgeProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <StatusBadge status={status} />
      <span className="text-[13px] tabular-nums text-[#a3a3a3]">
        Created {formatDateLong(createdAt)}
      </span>
    </div>
  );
}

