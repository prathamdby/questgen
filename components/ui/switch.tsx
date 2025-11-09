"use client";

interface SwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * Switch component for toggle functionality
 * Follows Apple-esque design with smooth transitions
 */
export function Switch({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-white dark:focus:ring-offset-black ${
        checked
          ? "bg-[#171717] dark:bg-white"
          : "bg-[#e5e5e5] dark:bg-[#333333]"
      }`}
      style={{ touchAction: "manipulation" }}
    >
      <span
        className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-in-out dark:bg-black ${
          checked ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
