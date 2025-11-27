import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-white/80 backdrop-blur-[12px] dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-6 h-16 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-90 dark:bg-white dark:text-black">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-sans text-[16px] font-semibold tracking-tight text-black dark:text-white">
              QuestGen
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
               href="/features"
               className="hidden text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white sm:block"
            >
               Features
            </Link>
            <Link
              href="/signin"
              className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
               href="/signup"
               className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
               Sign Up
            </Link>
          </nav>
      </div>
    </header>
  );
}
