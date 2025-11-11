"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Zap } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/home");
    }
  }, [session, isPending, router]);

  const handleGetStarted = async () => {
    const { signIn } = await import("@/lib/auth-client");
    await signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#171717] dark:border-[#333333] dark:border-t-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0066ff] opacity-[0.03] blur-[100px] dark:opacity-[0.08]"></div>
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#00d4ff] opacity-[0.02] blur-[80px] dark:opacity-[0.06]"></div>
      </div>

      <header className="relative z-10 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-[12px] dark:border-[#333333] dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
                <Sparkles className="h-4 w-4 text-white dark:text-[#171717]" />
              </div>
              <span className="font-sans text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                QuestGen
              </span>
            </div>
            <Link
              href="/signin"
              className="rounded-[6px] px-4 py-2 text-[15px] font-[500] text-[#171717] transition-colors hover:bg-[#f5f5f5] dark:text-white dark:hover:bg-[#1a1a1a]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
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
              Create custom question papers with AI in seconds. Upload your
              source materials, configure patterns, and let QuestGen handle the
              rest.
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
              <Link
                href="/signin"
                className="flex h-[52px] w-full items-center justify-center rounded-[8px] border border-[#e5e5e5] bg-white px-8 text-[17px] font-[600] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
              >
                View demo
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-[12px] border border-[#e5e5e5] bg-white p-8 transition-all duration-200 hover:border-[#d4d4d4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#404040] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
                <Sparkles className="h-6 w-6 text-white dark:text-[#171717]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                AI-powered generation
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Leverage advanced AI to create unique, contextually relevant
                question papers from your source materials in seconds.
              </p>
            </div>

            <div className="group rounded-[12px] border border-[#e5e5e5] bg-white p-8 transition-all duration-200 hover:border-[#d4d4d4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#404040] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
                <FileText className="h-6 w-6 text-white dark:text-[#171717]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                Flexible patterns
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Choose from multiple question patterns or create custom
                configurations to match your exact requirements.
              </p>
            </div>

            <div className="group rounded-[12px] border border-[#e5e5e5] bg-white p-8 transition-all duration-200 hover:border-[#d4d4d4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#404040] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)] sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
                <Zap className="h-6 w-6 text-white dark:text-[#171717]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                Instant solutions
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Automatically generate companion solution guides alongside your
                question papers for comprehensive preparation.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
          <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-gradient-to-br from-[#fafafa] to-white p-12 dark:border-[#333333] dark:from-[#0a0a0a] dark:to-black sm:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
                Ready to transform your workflow?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                Join educators and institutions using QuestGen to create better
                assessments faster.
              </p>
              <button
                onClick={handleGetStarted}
                className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-8 text-[17px] font-[600] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:inline-flex"
                style={{ touchAction: "manipulation" }}
              >
                <span>Start generating</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#e5e5e5] bg-white dark:border-[#333333] dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
                <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#171717]" />
              </div>
              <span className="font-sans text-[15px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                QuestGen
              </span>
            </div>
            <p className="text-[13px] text-[#666666] dark:text-[#888888]">
              © {new Date().getFullYear()} QuestGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
