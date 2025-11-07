import { Skeleton } from "@/components/ui/skeleton";

export function PaperDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* Back Link Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Header */}
        <header className="mb-12">
          {/* Status Badge */}
          <div className="mb-6">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Title */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-10 w-[85%]" />
            <Skeleton className="h-10 w-[60%]" />
          </div>

          {/* Metadata Grid */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-5 w-[90%]" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-5 w-[70%]" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-5 w-[60%]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex gap-2 sm:gap-3">
            <Skeleton className="h-[40px] w-24 sm:h-[44px]" />
            <Skeleton className="h-[40px] w-20 sm:h-[44px]" />
            <Skeleton className="h-[40px] w-20 sm:h-[44px]" />
          </div>

          {/* Source Files Section (if present) */}
          <div className="mb-8">
            <Skeleton className="mb-4 h-5 w-32" />
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-[6px] border border-[#e5e5e5] bg-white p-3 dark:border-[#262626] dark:bg-[#0a0a0a]">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4.5 w-[40%]" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <article className="space-y-6">
          {/* First paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[95%]" />
            <Skeleton className="h-5 w-[92%]" />
            <Skeleton className="h-5 w-[87%]" />
          </div>

          {/* Second paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[96%]" />
            <Skeleton className="h-5 w-[88%]" />
          </div>

          {/* Third section with heading */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-[45%]" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[94%]" />
              <Skeleton className="h-5 w-[91%]" />
            </div>
          </div>

          {/* Fourth section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-[97%]" />
            <Skeleton className="h-5 w-[89%]" />
            <Skeleton className="h-5 w-[85%]" />
          </div>

          {/* Fifth section with heading */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-[52%]" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[93%]" />
              <Skeleton className="h-5 w-[90%]" />
            </div>
          </div>

          {/* Sixth section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-[98%]" />
            <Skeleton className="h-5 w-[92%]" />
          </div>

          {/* Final section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-[95%]" />
            <Skeleton className="h-5 w-[86%]" />
            <Skeleton className="h-5 w-[82%]" />
          </div>
        </article>
      </div>
    </div>
  );
}
