"use client";

import { ChevronDown } from "lucide-react";

export interface PatternPreset {
  id: string;
  label: string;
  description: string;
  pattern: string;
}

interface PatternPresetsButtonProps {
  activePreset: PatternPreset | null;
  isExpanded: boolean;
  onToggle: () => void;
  panelId: string;
}

export function PatternPresetsButton({
  activePreset,
  isExpanded,
  onToggle,
  panelId,
}: PatternPresetsButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 text-[12px] font-[500] uppercase tracking-[0.18em] text-[#6b6b6b] transition-colors hover:text-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] dark:text-[#969696] dark:hover:text-white dark:focus-visible:outline-white"
    >
      <span>Presets</span>
      <span className="max-w-[140px] truncate text-[11px] font-[500] tracking-normal text-[#a3a3a3] dark:text-[#bfbfbf]">
        {activePreset ? activePreset.label : "Browse"}
      </span>
      <ChevronDown
        className={`h-3 w-3 transition-transform duration-150 ${
          isExpanded ? "rotate-180" : ""
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

interface PatternPresetsListProps {
  presets: PatternPreset[];
  selectedId: string | null;
  isExpanded: boolean;
  onSelect: (preset: PatternPreset) => void;
  panelId: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function PatternPresetsList({
  presets,
  selectedId,
  isExpanded,
  onSelect,
  panelId,
  textareaRef,
}: PatternPresetsListProps) {
  const handlePresetSelect = (preset: PatternPreset) => {
    onSelect(preset);
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      requestAnimationFrame(() => {
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length,
        );
      });
    }
  };

  if (presets.length === 0 || !isExpanded) return null;

  return (
    <fieldset aria-labelledby="paper-pattern-presets-heading" className="mb-3">
      <legend id="paper-pattern-presets-heading" className="sr-only">
        Paper Pattern Presets
      </legend>
      <div
        id={panelId}
        role="radiogroup"
        aria-describedby="paper-pattern-description"
        className="flex flex-col gap-1"
      >
        {presets.map((preset) => {
          const isActive = selectedId === preset.id;
          const descriptionId = `paper-pattern-preset-${preset.id}-description`;
          return (
            <label key={preset.id} className="group/radio block">
              <input
                type="radio"
                name="paper-pattern-preset"
                value={preset.id}
                checked={isActive}
                onChange={() => handlePresetSelect(preset)}
                className="peer sr-only"
                aria-describedby={descriptionId}
              />
              <div
                className={`flex min-h-[42px] items-center justify-between gap-3 rounded-[9px] border px-3 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#171717] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-white dark:peer-focus-visible:ring-offset-[#050505] ${
                  isActive
                    ? "border-[#171717] bg-white text-[#171717] shadow-[0_12px_32px_-26px_rgba(0,0,0,0.85)] dark:border-[#f1f1f1] dark:bg-[#101010] dark:text-[#f5f5f5]"
                    : "border-[#ededed] bg-transparent text-[#2f2f2f] hover:border-[#d6d6d6] dark:border-[#1a1a1a] dark:text-[#cecece] dark:hover:border-[#262626]"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-[500] tracking-[-0.01em]">
                    {preset.label}
                  </span>
                  <p
                    id={descriptionId}
                    className={`overflow-hidden text-[12px] leading-[1.45] text-[#5c5c5c] transition-[max-height,opacity] duration-150 ease-out dark:text-[#8f8f8f] ${
                      isActive
                        ? "max-h-16 opacity-100"
                        : "max-h-0 opacity-0 group-hover/radio:max-h-16 group-hover/radio:opacity-100 peer-focus-visible:max-h-16 peer-focus-visible:opacity-100"
                    }`}
                  >
                    {preset.description}
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
      </div>
    </fieldset>
  );
}
