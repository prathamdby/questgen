import Link from "next/link";
import { Sparkles, FileCheck, Download, ArrowRight } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "AI Generation",
    description: "Upload materials, get a complete paper",
  },
  {
    icon: FileCheck,
    title: "Instant Solutions",
    description: "Companion answer keys in one click",
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Print-ready papers, ready to go",
  },
] as const;

export function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="rounded-[12px] border border-[#e5e5e5] bg-[#fafafa] p-10 dark:border-[#262626] dark:bg-[#0a0a0a] sm:p-12">
        <h3 className="font-sans text-[28px] font-[600] leading-[1.1] tracking-[-0.02em] text-[#171717] dark:text-white sm:text-[32px]">
          Create your first paper in seconds
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
          Upload source materials and QuestGen handles the rest — pattern,
          duration, marks all pre-filled.
        </p>

        <Link
          href="/generate"
          className="group mt-8 inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-8 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
          style={{ touchAction: "manipulation" }}
        >
          <span>Create your first paper</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
                <item.icon
                  className="h-4 w-4 text-white dark:text-[#171717]"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[14px] font-[500] text-[#171717] dark:text-white">
                {item.title}
              </p>
              <p className="mt-1 text-[13px] leading-[1.5] text-[#737373]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
