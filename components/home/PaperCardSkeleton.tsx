import { Skeleton } from "@/components/ui/skeleton";

export function PaperCardSkeleton() {
  return (
    <div className="block w-full rounded-[8px] border border-[#e5e5e5] bg-white p-5 dark:border-[#262626] dark:bg-[#0a0a0a] sm:rounded-[6px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-1.5 h-5 w-[60%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
        <Skeleton className="h-8 w-8 flex-shrink-0" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#f5f5f5] pt-4 dark:border-[#262626]">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
