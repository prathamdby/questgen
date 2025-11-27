import Link from "next/link";
import { Github, Heart } from "lucide-react";

export function OpenSourceSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-white dark:border-[#333333] dark:bg-[#0a0a0a]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-12 sm:p-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#fafafa] px-3 py-1.5 text-[12px] font-[600] text-[#666666] dark:border-[#333333] dark:bg-[#1a1a1a] dark:text-[#888888]">
              <Heart className="h-3 w-3 text-red-500" />
              <span>OPEN SOURCE</span>
            </div>
            <h2 className="mb-6 font-sans text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
              Built for the community, <br /> by the community
            </h2>
            <p className="mb-8 text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              QuestGen is fully open source. We believe in transparency and the power of community-driven development. Inspect the code, contribute features, or self-host it.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="https://github.com/questgen/questgen"
                target="_blank"
                className="group inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-6 text-[15px] font-[600] text-white transition-all duration-150 hover:bg-[#404040] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5]"
              >
                <Github className="h-4 w-4" />
                <span>Star on GitHub</span>
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center border-t border-[#e5e5e5] bg-[#fafafa] p-12 dark:border-[#333333] dark:bg-[#111111] lg:border-l lg:border-t-0 lg:p-16">
            <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(#262626_1px,transparent_1px),linear-gradient(90deg,#262626_1px,transparent_1px)]"></div>
            
            <div className="relative z-10 w-full max-w-sm rounded-[12px] border border-[#e5e5e5] bg-white p-6 shadow-sm dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-[12px] font-mono text-[#888888]">questgen.tsx</div>
              </div>
              <div className="space-y-3 font-mono text-[13px] leading-[1.6]">
                <div className="flex gap-4">
                  <span className="text-[#888888]">1</span>
                  <span className="text-purple-600 dark:text-purple-400">export</span> <span className="text-blue-600 dark:text-blue-400">function</span> <span className="text-yellow-600 dark:text-yellow-400">QuestGen</span>() {"{"}
                </div>
                <div className="flex gap-4">
                  <span className="text-[#888888]">2</span>
                  <span className="pl-4 text-[#171717] dark:text-[#e5e5e5]">return (</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#888888]">3</span>
                  <span className="pl-8 text-green-600 dark:text-green-400">&lt;OpenSource /&gt;</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#888888]">4</span>
                  <span className="pl-4 text-[#171717] dark:text-[#e5e5e5]">);</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#888888]">5</span>
                  <span className="text-[#171717] dark:text-[#e5e5e5]">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
