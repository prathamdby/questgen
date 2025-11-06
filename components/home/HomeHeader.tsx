"use client";

export function HomeHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[#525252] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-colors dark:border-[#2f2f2f] dark:bg-[#050505] dark:text-[#a3a3a3]">
        <span
          className="inline-flex h-2 w-2 rounded-full bg-[#10b981] dark:bg-[#22c55e]"
          aria-hidden="true"
        />
        <span className="text-[13px] font-[500] tracking-[-0.01em]">
          Gemini Flash · Google GenAI
        </span>
      </div>
      <p className="text-[14px] text-[#737373] dark:text-[#8a8a8a]">
        Centralized, secure AI access for every paper
      </p>
    </div>
  );
}
