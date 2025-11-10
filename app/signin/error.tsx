"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SignInError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sign in error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-[440px] px-6">
        <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-8 dark:border-[#333333] dark:bg-black">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2] dark:bg-[#450a0a]">
              <AlertCircle
                className="h-6 w-6 text-[#ef4444] dark:text-[#fca5a5]"
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="mb-3 text-center font-sans text-[24px] font-[550] leading-[1.2] tracking-[-0.02em] text-[#171717] dark:text-white">
            Something went wrong
          </h1>

          <p className="mb-6 text-center text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            We encountered an error while loading the sign in page. Please try
            again.
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="flex h-[44px] w-full items-center justify-center rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
            >
              Try again
            </button>

            <Link
              href="/"
              className="flex h-[44px] w-full items-center justify-center rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
