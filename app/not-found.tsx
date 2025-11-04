"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Floating Papers Background Effect */}
        <div className="relative mb-12">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-32 w-32">
              {/* Floating Paper 1 */}
              <div
                className="absolute left-0 top-0 h-20 w-16 animate-[float_6s_ease-in-out_infinite] rounded-[4px] bg-[#fafafa] opacity-40 dark:bg-[#171717]"
                style={{ transform: "rotate(-12deg)" }}
              />
              {/* Floating Paper 2 */}
              <div
                className="absolute right-0 top-4 h-20 w-16 animate-[float_6s_ease-in-out_infinite_2s] rounded-[4px] bg-[#f5f5f5] opacity-40 dark:bg-[#262626]"
                style={{ transform: "rotate(8deg)" }}
              />
              {/* Floating Paper 3 */}
              <div
                className="absolute bottom-0 left-8 h-20 w-16 animate-[float_6s_ease-in-out_infinite_4s] rounded-[4px] bg-[#f0f0f0] opacity-40 dark:bg-[#1a1a1a]"
                style={{ transform: "rotate(-5deg)" }}
              />
            </div>
          </div>

          {/* Large 404 */}
          <h1 className="relative font-sans text-[120px] font-[600] leading-[1] tracking-[-0.05em] text-[#171717] dark:text-white sm:text-[160px]">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-10">
          <h2 className="font-sans text-[32px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
            This page took a study break
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/home"
            className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            <span>Go Home</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/generate"
            className="flex h-[44px] w-full items-center justify-center rounded-[6px] border border-[#e5e5e5] bg-white px-6 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white sm:w-auto"
          >
            Create New Paper
          </Link>
        </div>

        {/* Helper Links */}
        <div className="mt-12 flex items-center justify-center gap-6 text-[14px]">
          <Link
            href="/home"
            className="text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
          >
            Browse Papers
          </Link>
          <span className="text-[#e5e5e5] dark:text-[#333333]">·</span>
          <Link
            href="/signin"
            className="text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--rotate));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotate));
          }
        }
      `}</style>
    </div>
  );
}
