import { Target, BookOpen, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-gradient-to-br from-[#fafafa] to-white dark:border-[#333333] dark:from-[#0a0a0a] dark:to-black">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-12 sm:p-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[12px] font-[600] text-[#666666] dark:border-[#333333] dark:bg-black dark:text-[#888888]">
              <Target className="h-3 w-3" />
              <span>SIMPLE WORKFLOW</span>
            </div>
            <h2 className="mb-6 font-sans text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
              Three steps to perfect question papers
            </h2>
            <p className="mb-8 text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              QuestGen makes creating professional assessments effortless. No
              technical knowledge required.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Upload your materials",
                  desc: "Drop in your PDFs, documents, or text files containing the source content",
                },
                {
                  step: 2,
                  title: "Configure your pattern",
                  desc: "Choose question types, set duration and marks, and customize to your needs",
                },
                {
                  step: 3,
                  title: "Generate and export",
                  desc: "Get your complete question paper with optional solutions in seconds",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#171717] text-[15px] font-[600] text-white dark:bg-white dark:text-[#171717]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#fafafa] p-12 dark:bg-[#0a0a0a] sm:p-16">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-[#0066ff] to-[#00d4ff] opacity-10 blur-xl"></div>
              <div className="relative space-y-4">
                <div className="rounded-[10px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgb(0,0,0,0.06)] dark:border-[#333333] dark:bg-black">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
                      <BookOpen className="h-5 w-5 text-white dark:text-[#171717]" />
                    </div>
                    <div>
                      <div className="text-[15px] font-[600] text-[#171717] dark:text-white">
                        Mathematics Final
                      </div>
                      <div className="text-[13px] text-[#666666] dark:text-[#888888]">
                        180 min · 100 marks
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-[#f5f5f5] dark:bg-[#1a1a1a]">
                      <div className="h-2 w-3/4 rounded-full bg-[#171717] dark:bg-white"></div>
                    </div>
                    <div className="text-[13px] text-[#666666] dark:text-[#888888]">
                      Generated with solutions
                    </div>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#e5e5e5] bg-white p-6 shadow-[0_4px_12px_rgb(0,0,0,0.06)] dark:border-[#333333] dark:bg-black">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white">
                      <CheckCircle2 className="h-5 w-5 text-white dark:text-[#171717]" />
                    </div>
                    <div>
                      <div className="text-[15px] font-[600] text-[#171717] dark:text-white">
                        Physics Quiz
                      </div>
                      <div className="text-[13px] text-[#666666] dark:text-[#888888]">
                        60 min · 50 marks
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-[#f5f5f5] dark:bg-[#1a1a1a]">
                      <div className="h-2 w-full rounded-full bg-[#171717] dark:bg-white"></div>
                    </div>
                    <div className="text-[13px] text-[#666666] dark:text-[#888888]">
                      Ready for export
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
