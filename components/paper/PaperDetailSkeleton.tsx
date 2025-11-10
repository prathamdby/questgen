import { Skeleton } from "@/components/ui/skeleton";

const metadataSkeletons = [
  { labelWidth: "w-20", valueWidth: "w-[90%]" },
  { labelWidth: "w-24", valueWidth: "w-[70%]" },
  { labelWidth: "w-28", valueWidth: "w-[60%]" },
] as const;

const actionWidths = ["w-24", "w-20", "w-20"] as const;

const contentSkeletonSections = [
  {
    headingWidth: null,
    lineWidths: ["w-full", "w-[95%]", "w-[92%]", "w-[87%]"],
  },
  { headingWidth: null, lineWidths: ["w-full", "w-[96%]", "w-[88%]"] },
  { headingWidth: "w-[45%]", lineWidths: ["w-full", "w-[94%]", "w-[91%]"] },
  { headingWidth: null, lineWidths: ["w-[97%]", "w-[89%]", "w-[85%]"] },
  { headingWidth: "w-[52%]", lineWidths: ["w-full", "w-[93%]", "w-[90%]"] },
  { headingWidth: null, lineWidths: ["w-[98%]", "w-[92%]"] },
  { headingWidth: null, lineWidths: ["w-[95%]", "w-[86%]", "w-[82%]"] },
] as const;

export function PaperDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>

        <header className="mb-12">
          <div className="mb-6">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <div className="mb-6 space-y-2">
            <Skeleton className="h-10 w-[85%]" />
            <Skeleton className="h-10 w-[60%]" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {metadataSkeletons.map((skeleton) => (
              <div key={skeleton.labelWidth}>
                <Skeleton className={`mb-2 h-4 ${skeleton.labelWidth}`} />
                <Skeleton className={`h-5 ${skeleton.valueWidth}`} />
              </div>
            ))}
          </div>

          <div className="mb-8 flex gap-2 sm:gap-3">
            {actionWidths.map((width) => (
              <Skeleton
                key={width}
                className={`h-[40px] ${width} sm:h-[44px]`}
              />
            ))}
          </div>

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

        <article className="space-y-6">
          {contentSkeletonSections.map((section, index) => (
            <div key={`section-${index}`} className="space-y-3">
              {section.headingWidth ? (
                <Skeleton className={`h-6 ${section.headingWidth}`} />
              ) : null}
              <div className="space-y-2">
                {section.lineWidths.map((lineWidth, lineIndex) => (
                  <Skeleton
                    key={`line-${lineIndex}`}
                    className={`h-5 ${lineWidth}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}
