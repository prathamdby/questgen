import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaperNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-black">
      <div className="w-full max-w-[480px] text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2] dark:bg-[#450a0a]">
            <AlertCircle
              className="h-6 w-6 text-[#ef4444] dark:text-[#fca5a5]"
              aria-hidden="true"
            />
          </div>
        </div>

        <h1 className="mb-3 font-sans text-[26px] font-[550] leading-[1.2] tracking-[-0.02em] text-[#171717] dark:text-white">
          Paper not found
        </h1>

        <p className="mb-8 text-[15px] leading-[1.6] text-[#666666] dark:text-[#8c8c8c]">
          The question paper you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>

        <Link
          href="/home"
          className="inline-flex h-[44px] items-center justify-center rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
