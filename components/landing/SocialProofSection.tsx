import { Users, FileText, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="mb-16 text-center">
        <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[48px]">
          Built for educators,
          <br />
          trusted by institutions
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
          Join thousands of educators who have already transformed their
          assessment creation process.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#171717] dark:bg-white">
            <Users className="h-8 w-8 text-white dark:text-[#171717]" />
          </div>
          <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-[#171717] dark:text-white">
            10k+
          </div>
          <p className="text-[15px] text-[#666666] dark:text-[#888888]">
            Educators using QuestGen
          </p>
        </div>

        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#171717] dark:bg-white">
            <FileText className="h-8 w-8 text-white dark:text-[#171717]" />
          </div>
          <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-[#171717] dark:text-white">
            50k+
          </div>
          <p className="text-[15px] text-[#666666] dark:text-[#888888]">
            Question papers generated
          </p>
        </div>

        <div className="text-center sm:col-span-2 lg:col-span-1">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#171717] dark:bg-white">
            <TrendingUp className="h-8 w-8 text-white dark:text-[#171717]" />
          </div>
          <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-[#171717] dark:text-white">
            92%
          </div>
          <p className="text-[15px] text-[#666666] dark:text-[#888888]">
            Time saved on average
          </p>
        </div>
      </div>
    </section>
  );
}
