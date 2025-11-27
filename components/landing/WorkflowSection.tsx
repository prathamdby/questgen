import { Target } from "lucide-react";

export function WorkflowSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="overflow-hidden rounded-[24px] border border-[#e5e5e5] bg-gradient-to-br from-[#fafafa] to-white dark:border-[#27272a] dark:from-[#09090b] dark:to-[#18181b]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[12px] font-[600] text-[#666666] dark:border-[#27272a] dark:bg-[#18181b] dark:text-zinc-400">
              <Target className="h-3 w-3" />
              <span>SIMPLIFIED WORKFLOW</span>
            </div>
            <h2 className="mb-6 font-sans text-[32px] font-bold leading-[1.1] tracking-tight text-[#171717] dark:text-white sm:text-[40px]">
              From source material to
              <br />
              final paper in minutes
            </h2>
            <p className="mb-10 text-[16px] leading-[1.6] text-[#666666] dark:text-zinc-400">
              QuestGen abstracts away the complexity of formatting and question design, allowing you to focus on the curriculum.
            </p>

            <div className="relative space-y-10 pl-2">
              {/* Vertical line - Centered on the numbers: pl-2 (8px) + w-10/2 (20px) = 28px */}
              <div className="absolute top-4 bottom-10 left-[28px] w-[2px] -translate-x-1/2 bg-[#e5e5e5] dark:bg-[#27272a]"></div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[2px] border-white bg-[#171717] text-[15px] font-[700] text-white shadow-sm ring-4 ring-[#f5f5f5] dark:border-[#09090b] dark:bg-white dark:text-black dark:ring-[#18181b]">
                  1
                </div>
                <div className="pt-1">
                  <h3 className="mb-2 text-[18px] font-semibold tracking-tight text-[#171717] dark:text-white">
                    Upload Materials
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-zinc-400">
                    Ingest PDFs, Word docs, or plain text. The system extracts semantic meaning and key concepts automatically.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[2px] border-white bg-[#171717] text-[15px] font-[700] text-white shadow-sm ring-4 ring-[#f5f5f5] dark:border-[#09090b] dark:bg-white dark:text-black dark:ring-[#18181b]">
                  2
                </div>
                <div className="pt-1">
                  <h3 className="mb-2 text-[18px] font-semibold tracking-tight text-[#171717] dark:text-white">
                    Configure Parameters
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-zinc-400">
                    Set constraints for cognitive difficulty, question distribution, and total marks to match your assessment criteria.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[2px] border-white bg-[#171717] text-[15px] font-[700] text-white shadow-sm ring-4 ring-[#f5f5f5] dark:border-[#09090b] dark:bg-white dark:text-black dark:ring-[#18181b]">
                  3
                </div>
                <div className="pt-1">
                  <h3 className="mb-2 text-[18px] font-semibold tracking-tight text-[#171717] dark:text-white">
                    Generate & Export
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-zinc-400">
                    Review the generated output, make granular adjustments if needed, and export to a polished PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#f5f5f5] p-12 dark:bg-[#121214] sm:p-16">
             <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]"></div>

            <div className="relative w-full max-w-sm space-y-4">
               {/* Decorative cards illustrating the process */}
               <div className="transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#18181b]/80">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 dark:bg-red-500/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2.5 w-24 bg-zinc-200 rounded mb-2 dark:bg-zinc-700"></div>
                        <div className="h-2 w-16 bg-zinc-100 rounded dark:bg-zinc-800"></div>
                     </div>
                     <div className="h-6 w-6 rounded-full border border-zinc-200 flex items-center justify-center dark:border-zinc-700">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                     </div>
                  </div>
               </div>

               <div className="transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl translate-x-6 rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#18181b]/80">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 dark:bg-blue-500/10">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2.5 w-20 bg-zinc-200 rounded mb-2 dark:bg-zinc-700"></div>
                        <div className="h-2 w-12 bg-zinc-100 rounded dark:bg-zinc-800"></div>
                     </div>
                     <div className="h-6 w-6 rounded-full border border-zinc-200 flex items-center justify-center dark:border-zinc-700">
                         <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                     </div>
                  </div>
               </div>

               <div className="transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl -translate-x-4 rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#18181b]/80">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500 dark:bg-green-500/10">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2.5 w-28 bg-zinc-200 rounded mb-2 dark:bg-zinc-700"></div>
                        <div className="h-2 w-20 bg-zinc-100 rounded dark:bg-zinc-800"></div>
                     </div>
                     <div className="h-6 w-6 rounded-full border border-zinc-200 flex items-center justify-center dark:border-zinc-700">
                         <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
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
