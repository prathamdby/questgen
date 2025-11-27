import Link from "next/link";
import { Sparkles, Github } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-[12px] dark:border-[#333333] dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between sm:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
            <Sparkles className="h-4 w-4 text-white dark:text-[#171717]" />
          </div>
          <span className="font-sans text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
            QuestGen
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/questgen/questgen"
            target="_blank"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-[#666666] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717] dark:text-[#888888] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="/signin"
            className="rounded-[6px] bg-[#171717] px-4 py-2 text-[14px] font-[500] text-white transition-all hover:bg-[#404040] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
