"use client";

import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { AppPreview } from "./AppPreview";

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
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-[100px] rounded-full"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-[13px] font-[500] text-muted-foreground shadow-sm transition-all hover:bg-background/80 hover:shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Intelligent Assessment Orchestration</span>
          </div>

          <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-[80px]">
            The new standard for
            <br />
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              academic assessments
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            QuestGen provides the infrastructure for educators to generate, refine, and distribute professional-grade question papers with unprecedented speed and precision.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleGetStarted}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-8 text-[15px] font-semibold text-background transition-all hover:bg-foreground/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
            >
              <span>Start Generating</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={handleViewDemo}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 text-[15px] font-semibold text-foreground transition-all hover:bg-muted hover:text-foreground hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
            >
              <span>Explore Features</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* App Preview Section */}
        <div className="mt-20 sm:mt-24">
          <AppPreview />
        </div>
      </div>
    </section>
  );
}
