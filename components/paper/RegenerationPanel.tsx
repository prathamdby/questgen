"use client";

import { useState, useRef, useEffect } from "react";

const FEEDBACK_CHIPS = [
  {
    id: "too-easy",
    label: "Too Easy",
    instruction:
      "Increase overall difficulty. Add more analytical and application-based questions.",
  },
  {
    id: "too-hard",
    label: "Too Hard",
    instruction:
      "Reduce difficulty. Favor recall and comprehension over analysis.",
  },
  {
    id: "more-mcqs",
    label: "More MCQs",
    instruction:
      "Replace some short/long answer questions with multiple choice questions.",
  },
  {
    id: "less-theory",
    label: "Less Theory",
    instruction:
      "Reduce purely theoretical questions. Add more practical and applied problems.",
  },
  {
    id: "shorter",
    label: "Shorter Questions",
    instruction:
      "Break long questions into shorter, more focused sub-questions.",
  },
  {
    id: "more-variety",
    label: "More Variety",
    instruction: "Increase diversity of question types and topic coverage.",
  },
] as const;

interface RegenerationPanelProps {
  isOpen: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onRegenerate: (notes: string) => void;
  isRegenerating: boolean;
  panelId: string;
}

export function RegenerationPanel({
  isOpen,
  notes,
  onNotesChange,
  onRegenerate,
  isRegenerating,
  panelId,
}: RegenerationPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedChips(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleChip = (chip: (typeof FEEDBACK_CHIPS)[number]) => {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(chip.id)) {
        next.delete(chip.id);
        onNotesChange(
          notes
            .replace(chip.instruction, "")
            .replace(/\n{2,}/g, "\n")
            .trim(),
        );
      } else {
        next.add(chip.id);
        onNotesChange(
          notes ? `${notes}\n${chip.instruction}` : chip.instruction,
        );
      }
      return next;
    });
  };

  return (
    <div
      id={panelId}
      className="mt-3 rounded-[8px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]"
    >
      <label
        htmlFor="regen-notes"
        className="mb-2 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
      >
        Regeneration notes
      </label>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {FEEDBACK_CHIPS.map((chip) => {
          const isActive = selectedChips.has(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => toggleChip(chip)}
              disabled={isRegenerating}
              className={`inline-flex h-[28px] items-center rounded-full px-3 text-[12px] font-[500] transition-all duration-150 ${
                isActive
                  ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                  : "border border-[#e5e5e5] bg-white text-[#525252] hover:border-[#d4d4d4] hover:text-[#171717] dark:border-[#333333] dark:bg-black dark:text-[#a3a3a3] dark:hover:border-[#525252] dark:hover:text-white"
              } ${isRegenerating ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      <textarea
        id="regen-notes"
        ref={textareaRef}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={3}
        placeholder="Example: Tighten the Section B difficulty and add a case-study question in Section C."
        className="block w-full resize-none rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-2 text-[14px] leading-[1.5] text-[#171717] placeholder-[#a3a3a3] transition-colors duration-150 focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:focus:border-white dark:focus:ring-white"
        disabled={isRegenerating}
        aria-describedby="regen-notes-helper"
      />
      <p
        id="regen-notes-helper"
        className="mt-2 text-[12px] leading-[1.6] text-[#6d6d6d] dark:text-[#737373]"
      >
        Keep the structure intact—only describe the adjustments you want.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => onRegenerate(notes)}
          disabled={isRegenerating || notes.trim().length === 0}
          className={`inline-flex h-[36px] items-center justify-center rounded-[6px] px-4 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRegenerating || notes.trim().length === 0
              ? "cursor-not-allowed bg-[#e5e5e5] text-[#a3a3a3] dark:bg-[#1a1a1a] dark:text-[#4d4d4d]"
              : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
          }`}
        >
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
}
