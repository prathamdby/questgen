"use client";

import { useState, createContext, useContext } from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string) => {
    if (!controlledValue) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function TabsList({
  children,
  className = "",
  ariaLabel,
}: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex h-[42px] w-full items-center justify-start gap-1 rounded-[8px] border border-[#e5e5e5] bg-[#fafafa] p-1 dark:border-[#262626] dark:bg-[#0f0f0f] ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      onClick={() => onValueChange(value)}
      className={`flex h-[34px] flex-1 items-center justify-center whitespace-nowrap rounded-[6px] px-4 text-[14px] font-[500] tracking-[-0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa] disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#0f0f0f] ${
        isSelected
          ? "bg-white text-[#171717] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-[#171717] dark:text-white dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          : "text-[#737373] hover:text-[#171717] dark:text-[#8c8c8c] dark:hover:text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
