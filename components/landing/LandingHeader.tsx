import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="relative z-10 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-[12px] dark:border-[#333333] dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
              <Sparkles className="h-4 w-4 text-white dark:text-[#171717]" />
            </div>
            <span className="font-sans text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
              QuestGen
            </span>
          </Link>
          <Link
            href="/signin"
            className="rounded-[6px] px-4 py-2 text-[15px] font-[500] text-[#171717] transition-colors hover:bg-[#f5f5f5] dark:text-white dark:hover:bg-[#1a1a1a]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
