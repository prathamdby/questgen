import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-[#e5e5e5] bg-white dark:border-[#333333] dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
              <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#171717]" />
            </div>
            <span className="font-sans text-[15px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
              QuestGen
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              href="/legal"
              className="text-[13px] font-[500] text-[#666666] transition-colors hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:text-[#888888] dark:hover:text-white dark:focus:ring-white"
            >
              Terms & Privacy
            </Link>
            <p className="text-[13px] text-[#666666] dark:text-[#888888]">
              © {new Date().getFullYear()} QuestGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
