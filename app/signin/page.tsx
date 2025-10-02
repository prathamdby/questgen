"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { initiateOpenRouterAuth, isAuthenticated } from "@/lib/openrouter-auth";

export default function SignIn() {
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/home");
    }
  }, [router]);

  const handleOpenRouterSignIn = () => {
    initiateOpenRouterAuth();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-[380px] px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            Sign in
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            Continue to Question Paper Generator
          </p>
        </div>

        {/* Sign In Card */}
        <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-6 dark:border-[#333333] dark:bg-black">
          {/* OpenRouter Sign In Button */}
          <button
            onClick={handleOpenRouterSignIn}
            className="group relative flex h-[44px] w-full items-center justify-center gap-3 rounded-[6px] border border-[#e5e5e5] bg-white px-4 text-[15px] font-[500] text-[#171717] transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
            aria-label="Sign in with OpenRouter"
          >
            {/* OpenRouter Logo */}
            <Image
              src="/openrouter.svg"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 dark:invert"
              aria-hidden="true"
            />
            <span>Continue with OpenRouter</span>
          </button>

          {/* Divider with subtle text */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e5e5] dark:border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="bg-white px-3 text-[#a3a3a3] dark:bg-black dark:text-[#666666]">
                Secure authentication
              </span>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-center text-[12px] leading-[1.5] text-[#a3a3a3] dark:text-[#666666]">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#737373]">
            Need help?{" "}
            <a
              href="#"
              className="font-[500] text-[#171717] transition-colors hover:text-[#525252] dark:text-white dark:hover:text-[#a3a3a3]"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
