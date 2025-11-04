"use client";

import Image from "next/image";

interface SignedInHeaderProps {
  onSignOut: () => void;
}

export function SignedInHeader({ onSignOut }: SignedInHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373]">
        <Image
          src="/openrouter.svg"
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 dark:invert"
          aria-hidden="true"
        />
        <span>Signed in with OpenRouter</span>
      </div>
      <button
        onClick={onSignOut}
        className="text-[14px] font-[500] text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
