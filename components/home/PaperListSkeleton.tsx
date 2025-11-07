import { Skeleton } from "@/components/ui/skeleton";

export function PaperListSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 dark:border-[#262626] dark:bg-[#0a0a0a]">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <Skeleton className="h-5 w-[70%]" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4.5 w-[85%]" />
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-4.5 w-20" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-4.5 w-16" />
          </div>
          <Skeleton className="h-4.5 w-20" />
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <div className=" hidden items-center gap-1 sm:flex">
          <Skeleton className="h-4.5 w-12" />
          <Skeleton className="h-3.5 w-3.5" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
