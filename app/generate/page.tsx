import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { GenerateForm } from "@/components/generate/GenerateForm";

async function GenerateContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        <Link
          href="/home"
          className="group mb-8 inline-flex items-center gap-2 text-[14px] font-[500] text-[#737373] transition-colors hover:text-[#171717] dark:hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Back to home</span>
        </Link>

        <header className="mb-16">
          <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            QuestGen
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            Configure your question paper settings and upload source materials
          </p>
        </header>

        <GenerateForm />
      </div>
    </div>
  );
}

function GenerateFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="space-y-10">
          <div className="h-4 w-32 rounded-full bg-[#f5f5f5] dark:bg-[#1a1a1a]" />
          <div className="space-y-4">
            <div className="h-[44px] w-full rounded-[6px] bg-[#f5f5f5] dark:bg-[#1f1f1f]" />
            <div className="h-[120px] w-full rounded-[6px] bg-[#f5f5f5] dark:bg-[#1f1f1f]" />
            <div className="h-[44px] w-full rounded-[6px] bg-[#f5f5f5] dark:bg-[#1f1f1f]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<GenerateFallback />}>
      <GenerateContent />
    </Suspense>
  );
}
