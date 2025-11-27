import Link from "next/link";
import { Sparkles, Github, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-[#e5e5e5] bg-white dark:border-[#333333] dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
              <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#171717]" />
            </div>
            <span className="font-sans text-[15px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
              QuestGen
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/questgen/questgen"
              target="_blank"
              className="text-[#666666] transition-colors hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/questgen"
              target="_blank"
              className="text-[#666666] transition-colors hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#e5e5e5] dark:bg-[#333333]"></div>
            <Link
              href="/legal"
              className="text-[13px] font-[500] text-[#666666] transition-colors hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
            >
              Terms & Privacy
            </Link>
            <p className="text-[13px] text-[#666666] dark:text-[#888888]">
              © {new Date().getFullYear()} QuestGen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
