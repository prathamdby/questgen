"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";

interface SignedInHeaderProps {
  onSignOut: () => void;
}

export function SignedInHeader({ onSignOut }: SignedInHeaderProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373]">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 rounded-full"
            aria-hidden="true"
          />
        ) : (
          <div className="h-4 w-4 rounded-full bg-[#e5e5e5] dark:bg-[#333333]" />
        )}
        <span>Signed in as {session.user.name || session.user.email}</span>
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
