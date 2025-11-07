import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-[6px] bg-[#f5f5f5] dark:bg-[#1a1a1a]",
        className,
      )}
    />
  );
}
