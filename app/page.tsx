import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";

export const metadata: Metadata = {
  title: "QuestGen - Intelligent Assessment Orchestration",
  description:
    "The new standard for academic assessments. Generate professional question papers and solutions from your source materials with AI-powered precision.",
  keywords: [
    "question paper generator",
    "AI assessment",
    "exam automation",
    "education infrastructure",
    "teacher tools",
    "test generation",
  ],
  authors: [{ name: "QuestGen" }],
  openGraph: {
    title: "QuestGen - Intelligent Assessment Orchestration",
    description:
      "Generate professional question papers and solutions from your source materials with AI-powered precision.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestGen - Intelligent Assessment Orchestration",
    description:
      "Generate professional question papers and solutions from your source materials with AI-powered precision.",
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
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">
      <LandingHeader />

      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <StatsSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
