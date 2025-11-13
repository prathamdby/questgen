"use client";

import type { PastPaperStrategy } from "@/lib/past-paper-strategies";

interface PastPaperStrategyListProps {
  strategies: PastPaperStrategy[];
  selectedId: string;
  onSelect: (strategyId: string) => void;
}

export function PastPaperStrategyList({
  strategies,
  selectedId,
  onSelect,
}: PastPaperStrategyListProps) {
  if (strategies.length === 0) return null;

  return (
    <fieldset
      className="space-y-1"
      aria-labelledby="past-paper-strategies-heading"
      role="radiogroup"
    >
      <legend id="past-paper-strategies-heading" className="sr-only">
        Past paper analysis strategies
      </legend>
      {strategies.map((strategy) => {
        const isActive = selectedId === strategy.id;
        const descriptionId = `past-paper-strategy-${strategy.id}-description`;

        return (
          <label key={strategy.id} className="group/radio block">
            <input
              type="radio"
              name="past-paper-strategy"
              value={strategy.id}
              checked={isActive}
              onChange={() => onSelect(strategy.id)}
              className="peer sr-only"
              aria-describedby={descriptionId}
            />
            <div
              className={`flex min-h-[46px] items-center justify-between gap-3 rounded-[9px] border px-3 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#171717] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-white dark:peer-focus-visible:ring-offset-[#050505] ${
                isActive
                  ? "border-[#171717] bg-white text-[#171717] shadow-[0_12px_32px_-26px_rgba(0,0,0,0.85)] dark:border-[#f1f1f1] dark:bg-[#101010] dark:text-[#f5f5f5]"
                  : "border-[#ededed] bg-transparent text-[#2f2f2f] hover:border-[#d6d6d6] dark:border-[#1a1a1a] dark:text-[#cecece] dark:hover:border-[#262626]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[13px] font-[500] tracking-[-0.01em]">
                  {strategy.label}
                </span>
                <p
                  id={descriptionId}
                  className={`overflow-hidden text-[12px] leading-[1.45] text-[#5c5c5c] transition-[max-height,opacity] duration-150 ease-out dark:text-[#8f8f8f] ${
                    isActive
                      ? "max-h-20 opacity-100"
                      : "max-h-0 opacity-0 group-hover/radio:max-h-20 group-hover/radio:opacity-100 peer-focus-visible:max-h-20 peer-focus-visible:opacity-100"
                  }`}
                >
                  {strategy.description}
                </p>
              </div>
              <span
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                  isActive
                    ? "border-[#171717] bg-[#171717] dark:border-white dark:bg-white"
                    : "border-[#dcdcdc] bg-transparent dark:border-[#333333]"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
