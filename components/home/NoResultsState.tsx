"use client";

import { Search } from "lucide-react";

export function NoResultsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
        <Search className="h-8 w-8 text-[#737373]" aria-hidden="true" />
      </div>
      <h3 className="text-[17px] font-[500] text-[#171717] dark:text-white">
        No papers found
      </h3>
      <p className="mt-2 text-[14px] text-[#737373]">
        Try adjusting your search query
      </p>
    </div>
  );
}
