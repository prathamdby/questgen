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
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-[500] text-[#666666] dark:border-[#333333] dark:bg-black dark:text-[#888888]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Powered by AI</span>
        </div>

        <h1 className="font-sans text-[56px] font-[650] leading-[1.05] tracking-[-0.04em] text-[#171717] dark:text-white sm:text-[72px] lg:text-[96px]">
          Generate question
          <br />
          papers instantly
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-[19px] leading-[1.5] text-[#666666] dark:text-[#888888] sm:text-[21px]">
          Create custom question papers with AI in seconds. Upload your source
          materials, configure patterns, and let QuestGen handle the rest.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGetStarted}
            className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-8 text-[17px] font-[600] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            <span>Get started free</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={handleViewDemo}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-8 text-[17px] font-[600] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
          >
            <span>View demo</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
