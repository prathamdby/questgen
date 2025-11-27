"use client";

import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

export function HeroSection() {
  const handleGetStarted = async () => {
    const { signIn } = await import("@/lib/auth-client");
    await signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  };

  const handleViewDemo = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-[500] text-[#666666] shadow-[0_2px_10px_rgb(0,0,0,0.02)] dark:border-[#333333] dark:bg-black dark:text-[#888888]">
          <Sparkles className="h-3.5 w-3.5 text-[#0066ff]" />
          <span className="bg-gradient-to-r from-[#171717] to-[#666666] bg-clip-text text-transparent dark:from-white dark:to-[#888888]">
            AI-Powered Assessment Generation
          </span>
        </div>

        <h1 className="font-sans text-[56px] font-[650] leading-[1.05] tracking-[-0.04em] text-[#171717] dark:text-white sm:text-[72px] lg:text-[96px]">
          Generate question
          <br />
          <span className="text-[#666666] dark:text-[#888888]">
            papers instantly.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-[19px] leading-[1.5] text-[#666666] dark:text-[#888888] sm:text-[21px]">
          Create custom question papers with AI in seconds. Upload your source
          materials, configure patterns, and export professional PDFs. Open Source and free forever.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGetStarted}
            className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-8 text-[17px] font-[600] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            <span>Start generating</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={handleViewDemo}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-8 text-[17px] font-[600] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
          >
            <span>Learn more</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Hero Visual Mockup */}
      <div className="mt-20 relative">
         <div className="absolute -inset-1 rounded-[16px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg dark:opacity-30"></div>
         <div className="relative rounded-[12px] border border-[#e5e5e5] bg-white shadow-2xl overflow-hidden dark:border-[#333333] dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-2 border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3 dark:border-[#333333] dark:bg-[#111111]">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="mx-auto flex w-full max-w-[200px] items-center justify-center rounded-[4px] bg-white px-3 py-1 text-[11px] font-[500] text-[#666666] shadow-sm dark:bg-[#1a1a1a] dark:text-[#888888]">
                questgen.app/paper/preview
              </div>
            </div>
            
            <div className="p-8 sm:p-12 bg-white dark:bg-[#0a0a0a] min-h-[300px] flex flex-col items-center justify-center border-b border-dashed border-[#e5e5e5] dark:border-[#333333]">
                <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4 dark:border-[#333333]">
                        <div>
                            <div className="h-8 w-48 rounded bg-[#171717] dark:bg-white mb-2"></div>
                            <div className="h-4 w-32 rounded bg-[#e5e5e5] dark:bg-[#333333]"></div>
                        </div>
                        <div className="text-right">
                             <div className="h-4 w-24 rounded bg-[#e5e5e5] dark:bg-[#333333] mb-2 ml-auto"></div>
                             <div className="h-4 w-20 rounded bg-[#e5e5e5] dark:bg-[#333333] ml-auto"></div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 rounded bg-[#e5e5e5] dark:bg-[#333333] flex-shrink-0"></div>
                                    <div className="w-full space-y-2">
                                        <div className="h-4 w-full rounded bg-[#f5f5f5] dark:bg-[#1a1a1a]"></div>
                                        <div className="h-4 w-3/4 rounded bg-[#f5f5f5] dark:bg-[#1a1a1a]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>
      </div>
    </section>
  );
}
