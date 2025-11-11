"use client";

import { Fragment } from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

const helperLinks = [
  { href: "/home", label: "Go Home" },
  { href: "/generate", label: "Generate Quest" },
] as const;

export function PaperNotFound({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#0a0a0a]">
            <FileText className="h-10 w-10 text-[#737373]" aria-hidden="true" />
          </div>
        </div>

        <div className="mb-10">
          <h1 className="font-sans text-[32px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
            This paper went missing
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            The paper you're looking for doesn't exist or may have been deleted.
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/home"
            className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            <span>Browse Papers</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex h-[44px] w-full items-center justify-center rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
              style={{ touchAction: "manipulation" }}
            >
              Try Again
            </button>
          )}
          <Link
            href="/generate"
            className="flex h-[44px] w-full items-center justify-center rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            Create New Quest
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-[14px]">
          {helperLinks.map((link, index) => (
            <Fragment key={link.href}>
              <Link
                href={link.href}
                className="text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
              >
                {link.label}
              </Link>
              {index === 0 ? (
                <span
                  className="text-[#e5e5e5] dark:text-[#333333]"
                  aria-hidden="true"
                >
                  ·
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
