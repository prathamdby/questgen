import { Target } from "lucide-react";

export function WorkflowSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
      <div className="overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-gradient-to-br from-[#fafafa] to-white dark:border-[#333333] dark:from-[#0a0a0a] dark:to-black">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-12 sm:p-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[12px] font-[600] text-[#666666] dark:border-[#333333] dark:bg-black dark:text-[#888888]">
              <Target className="h-3 w-3" />
              <span>SIMPLIFIED WORKFLOW</span>
            </div>
            <h2 className="mb-6 font-sans text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
              From source material to
              <br />
              final paper in minutes
            </h2>
            <p className="mb-8 text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              QuestGen abstracts away the complexity of formatting and question design, allowing you to focus on the curriculum.
            </p>

            <div className="relative space-y-8 pl-4">
              {/* Vertical line */}
              <div className="absolute top-2 bottom-6 left-[19px] w-[1px] bg-[#e5e5e5] dark:bg-[#333333]"></div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[15px] font-[600] text-[#171717] shadow-sm dark:border-[#333333] dark:bg-black dark:text-white">
                  1
                </div>
                <div className="pt-1">
                  <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                    Upload Materials
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                    Ingest PDFs, Word docs, or plain text. The system extracts semantic meaning and key concepts automatically.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[15px] font-[600] text-[#171717] shadow-sm dark:border-[#333333] dark:bg-black dark:text-white">
                  2
                </div>
                <div className="pt-1">
                  <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                    Configure Parameters
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                    Set constraints for cognitive difficulty, question distribution, and total marks to match your assessment criteria.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[15px] font-[600] text-[#171717] shadow-sm dark:border-[#333333] dark:bg-black dark:text-white">
                  3
                </div>
                <div className="pt-1">
                  <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
                    Generate & Export
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                    Review the generated output, make granular adjustments if needed, and export to a polished PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-[#f5f5f5] p-12 dark:bg-[#050505] sm:p-16">
             <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#333_1px,transparent_1px)]"></div>

            <div className="relative w-full max-w-sm space-y-4">
               {/* Decorative cards illustrating the process */}
               <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2 w-24 bg-muted rounded mb-1.5"></div>
                        <div className="h-1.5 w-16 bg-muted/60 rounded"></div>
                     </div>
                     <div className="h-4 w-4 rounded-full border border-border flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                     </div>
                  </div>
               </div>

               <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg translate-x-4 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2 w-20 bg-muted rounded mb-1.5"></div>
                        <div className="h-1.5 w-12 bg-muted/60 rounded"></div>
                     </div>
                     <div className="h-4 w-4 rounded-full border border-border flex items-center justify-center">
                         <div className="h-2 w-2 rounded-full bg-green-500"></div>
                     </div>
                  </div>
               </div>

               <div className="transform transition-all hover:-translate-y-1 hover:shadow-lg -translate-x-2 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                     </div>
                     <div className="flex-1">
                        <div className="h-2 w-28 bg-muted rounded mb-1.5"></div>
                        <div className="h-1.5 w-20 bg-muted/60 rounded"></div>
                     </div>
                     <div className="h-4 w-4 rounded-full border border-border flex items-center justify-center">
                         <div className="h-2 w-2 rounded-full bg-green-500"></div>
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
