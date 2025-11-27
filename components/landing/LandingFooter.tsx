import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white dark:border-[#27272a] dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
               <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black dark:bg-white">
                 <Sparkles className="h-3.5 w-3.5 text-white dark:text-black" />
               </div>
               <span className="font-sans text-[15px] font-[600] tracking-tight text-[#171717] dark:text-white">
                 QuestGen
               </span>
             </div>
             <p className="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Intelligent assessment orchestration for modern educators. Transform your workflow today.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
             <div className="space-y-3">
                <h4 className="text-sm font-semibold text-black dark:text-white">Product</h4>
                <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                   <li><Link href="/features" className="hover:text-black dark:hover:text-white">Features</Link></li>
                   <li><Link href="/integrations" className="hover:text-black dark:hover:text-white">Integrations</Link></li>
                   <li><Link href="/changelog" className="hover:text-black dark:hover:text-white">Changelog</Link></li>
                </ul>
             </div>
             <div className="space-y-3">
                <h4 className="text-sm font-semibold text-black dark:text-white">Company</h4>
                <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                   <li><Link href="/about" className="hover:text-black dark:hover:text-white">About</Link></li>
                   <li><Link href="/blog" className="hover:text-black dark:hover:text-white">Blog</Link></li>
                   <li><Link href="/careers" className="hover:text-black dark:hover:text-white">Careers</Link></li>
                </ul>
             </div>
             <div className="space-y-3">
                <h4 className="text-sm font-semibold text-black dark:text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                   <li><Link href="/privacy" className="hover:text-black dark:hover:text-white">Privacy</Link></li>
                   <li><Link href="/terms" className="hover:text-black dark:hover:text-white">Terms</Link></li>
                </ul>
             </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e5e5e5] pt-8 dark:border-[#27272a]">
           <p className="text-xs text-zinc-500 dark:text-zinc-500">
              © {new Date().getFullYear()} QuestGen. All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}
