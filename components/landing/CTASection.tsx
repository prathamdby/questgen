import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="relative overflow-hidden rounded-[20px] bg-[#171717] px-6 py-16 text-center shadow-2xl dark:bg-white sm:px-16 sm:py-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-blue-500 opacity-20 blur-[80px]"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-[300px] w-[300px] rounded-full bg-purple-500 opacity-20 blur-[80px]"></div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-[600] uppercase tracking-wider text-white/80 backdrop-blur-sm dark:border-black/10 dark:bg-black/5 dark:text-black/80">
            <Shield className="h-3 w-3" />
            <span>Secure & Reliable</span>
          </div>

          <h2 className="mb-6 font-sans text-4xl font-bold tracking-tight text-white dark:text-[#171717] sm:text-5xl">
            Ready to transform your assessment workflow?
          </h2>

          <p className="mb-10 text-lg leading-relaxed text-white/70 dark:text-[#171717]/70">
            Join thousands of forward-thinking educators and institutions who have switched to QuestGen. Experience the power of intelligent orchestration today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signin"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-[15px] font-semibold text-[#171717] transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#171717] dark:bg-[#171717] dark:text-white dark:hover:bg-[#333333] dark:focus:ring-[#171717] dark:focus:ring-offset-white"
            >
              Start Generating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
