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
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[13px] font-[500] text-white/90 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          <span>Powered by AI</span>
        </div>

        <h1 className="font-sans text-[56px] font-[650] leading-[1.05] tracking-[-0.04em] text-white sm:text-[72px] lg:text-[96px]">
          Generate question
          <br />
          papers instantly
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-[19px] leading-[1.5] text-white/90 sm:text-[21px]">
          Create custom question papers with AI in seconds. Upload your source
          materials, configure patterns, and let QuestGen handle the rest.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGetStarted}
            className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-white px-8 text-[17px] font-[600] text-[#b30000] transition-all duration-150 hover:bg-[#ffe5e5] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#ff1a1a] active:scale-[0.98] sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            <span>Get started free</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={handleViewDemo}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] border border-white/40 bg-white/5 px-8 text-[17px] font-[600] text-white backdrop-blur-sm transition-all duration-150 hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#ff1a1a] sm:w-auto"
          >
            <span>View demo</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
