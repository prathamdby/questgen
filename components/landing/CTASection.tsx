import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-gradient-to-br from-[#171717] to-[#404040] p-12 dark:border-[#333333] dark:from-[#0a0a0a] dark:to-[#1a1a1a] sm:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-[600] text-white/60 backdrop-blur-sm">
            <Shield className="h-3 w-3" />
            <span>SECURE & RELIABLE</span>
          </div>
          <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-[56px]">
            Ready to transform your workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.6] text-white/70">
            Join educators and institutions using QuestGen to create better
            assessments faster. Start generating professional question papers
            today.
          </p>
          <Link
            href="/signin"
            className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-white px-8 text-[17px] font-[600] text-[#171717] transition-all duration-150 hover:bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#171717] active:scale-[0.98]"
            style={{ touchAction: "manipulation" }}
          >
            <span>Start generating</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
