import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/20 bg-[#cc0000]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white">
              <Sparkles className="h-3.5 w-3.5 text-[#ff0000]" />
            </div>
            <span className="font-sans text-[15px] font-[600] tracking-[-0.01em] text-white">
              QuestGen
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              href="/legal"
              className="text-[13px] font-[500] text-white/70 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#cc0000]"
            >
              Terms & Privacy
            </Link>
            <p className="text-[13px] text-white/70">
              © {new Date().getFullYear()} QuestGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
