import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#09090b] px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-indigo-500/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-[600] uppercase tracking-wider text-zinc-400 backdrop-blur-sm">
            <Shield className="h-3 w-3" />
            <span>Secure & Reliable</span>
          </div>

          <h2 className="mb-6 font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to transform your assessment workflow?
          </h2>

          <p className="mb-10 text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Join thousands of forward-thinking educators and institutions who have switched to QuestGen. Experience the power of intelligent orchestration today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signin"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-black transition-all hover:bg-zinc-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#09090b]"
            >
              Start Generating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
               href="https://github.com"
               target="_blank"
               rel="noopener noreferrer"
               className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-[15px] font-semibold text-white transition-all hover:bg-white/10"
            >
               View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
