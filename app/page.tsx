import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { OpenSourceSection } from "@/components/landing/OpenSourceSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "QuestGen - AI-Powered Question Paper Generator",
  description:
    "Generate custom question papers instantly with AI. Upload source materials, choose patterns, and create professional assessments in seconds. Open Source and Free.",
  keywords: [
    "question paper generator",
    "AI question paper",
    "exam generator",
    "assessment creator",
    "education AI",
    "test generator",
    "open source",
    "free exam creator",
  ],
  authors: [{ name: "QuestGen" }],
  openGraph: {
    title: "QuestGen - AI-Powered Question Paper Generator",
    description:
      "Generate custom question papers instantly with AI. Perfect for educators and institutions. Open Source.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestGen - AI-Powered Question Paper Generator",
    description:
      "Generate custom question papers instantly with AI. Perfect for educators and institutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LandingPage() {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: cookieStore.toString(),
    }),
  });

  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black selection:bg-[#171717] selection:text-white dark:selection:bg-white dark:selection:text-[#171717]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-[100px] dark:from-blue-500/20"></div>
      </div>

      <LandingHeader />

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SocialProofSection />
        <OpenSourceSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
