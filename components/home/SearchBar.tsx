"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-[#737373]" aria-hidden="true" />
      </div>
      <input
        type="text"
        placeholder="Search papers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block h-[44px] w-full rounded-[6px] border border-[#e5e5e5] bg-white pl-10 pr-3 text-[15px] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
        aria-label="Search question papers"
      />
    </div>
  );
}
