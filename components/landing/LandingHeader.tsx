import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="relative z-50 border-b border-purple-500/20 bg-gradient-to-b from-black via-purple-950/30 to-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group relative flex items-center gap-3 transition-all duration-300"
          >
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-black/80 border border-purple-400/50">
                <Sparkles className="h-5 w-5 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text" />
              </div>
            </div>
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              QuestGen
            </span>
          </Link>
          <Link
            href="/signin"
            className="relative group px-5 py-2.5 text-sm font-semibold text-purple-100 rounded-lg overflow-hidden transition-all duration-300 hover:text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/40 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <span className="relative">Sign in</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
