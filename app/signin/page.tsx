import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/signin/SignInForm";
import { auth } from "@/lib/auth";

async function SignInContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-[380px] px-6">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            Sign in
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            Continue to QuestGen
          </p>
        </div>

        <SignInForm />

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

function SignInFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-[380px] px-6">
        <div className="space-y-8">
          <div className="h-12 w-full rounded-[6px] bg-[#f5f5f5] dark:bg-[#1f1f1f]" />
          <div className="h-[200px] w-full rounded-[8px] bg-[#f5f5f5] dark:bg-[#1f1f1f]" />
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}
