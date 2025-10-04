"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForKey } from "@/lib/openrouter-auth";

function OpenRouterCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received");
      return;
    }

    // Exchange code for API key
    exchangeCodeForKey(code).then((result) => {
      if ("error" in result) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        // Success! Redirect to home
        router.push("/home");
      }
    });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        {status === "loading" && (
          <>
            {/* Loading Spinner */}
            <div className="mb-6 flex justify-center">
              <svg
                className="h-12 w-12 animate-spin text-[#171717] dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h1 className="text-[24px] font-[550] text-[#171717] dark:text-white">
              Completing sign in...
            </h1>
            <p className="mt-3 text-[15px] text-[#737373]">
              Please wait while we authenticate your account
            </p>
          </>
        )}

        {status === "error" && (
          <>
            {/* Error Icon with Background */}
            <div className="relative mb-12">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-32 w-32">
                  {/* Subtle background shapes */}
                  <div
                    className="absolute left-0 top-0 h-20 w-16 animate-[float_6s_ease-in-out_infinite] rounded-[4px] bg-[#fafafa] opacity-40 dark:bg-[#171717]"
                    style={{ transform: "rotate(-12deg)" }}
                  />
                  <div
                    className="absolute right-0 top-4 h-20 w-16 animate-[float_6s_ease-in-out_infinite_2s] rounded-[4px] bg-[#f5f5f5] opacity-40 dark:bg-[#262626]"
                    style={{ transform: "rotate(8deg)" }}
                  />
                </div>
              </div>

              {/* Error Icon */}
              <div className="relative flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fef2f2] dark:bg-[#450a0a]">
                  <svg
                    className="h-12 w-12 text-[#ef4444] dark:text-[#f87171]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-10">
              <h1 className="font-sans text-[32px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[40px]">
                Authentication failed
              </h1>
              <p className="mt-4 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
                {errorMessage}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/signin")}
              className="group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-6 text-[15px] font-[500] text-white transition-all duration-150 hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              style={{ touchAction: "manipulation" }}
            >
              <span>Try Again</span>
              <svg
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

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
          </>
        )}
      </div>
    </div>
  );
}

export default function OpenRouterCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
          <div className="mx-auto w-full max-w-2xl px-6 text-center">
            <div className="mb-6 flex justify-center">
              <svg
                className="h-12 w-12 animate-spin text-[#171717] dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h1 className="text-[24px] font-[550] text-[#171717] dark:text-white">
              Loading...
            </h1>
          </div>
        </div>
      }
    >
      <OpenRouterCallbackContent />
    </Suspense>
  );
}
