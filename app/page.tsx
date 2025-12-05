import type { Metadata } from "next";
import {
  Sparkles,
  FileText,
  Zap,
  Clock,
  Download,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Shield,
  Rocket,
} from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "QuestGen - AI-Powered Question Paper Generator",
  description:
    "Generate custom question papers instantly with AI. Upload source materials, choose patterns, and create professional assessments in seconds. Perfect for educators and institutions.",
  keywords: [
    "question paper generator",
    "AI question paper",
    "exam generator",
    "assessment creator",
    "education AI",
    "test generator",
    "question bank",
    "automated assessment",
  ],
  authors: [{ name: "QuestGen" }],
  openGraph: {
    title: "QuestGen - AI-Powered Question Paper Generator",
    description:
      "Generate custom question papers instantly with AI. Perfect for educators and institutions.",
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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <LandingHeader />

      <main className="relative z-10">
        <HeroSection />

        {/* Features Section */}
        <section
          id="features"
          className="relative py-24 sm:py-32 bg-gradient-to-b from-black via-purple-950/10 to-black"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-20 text-center">
              <h2 className="font-playfair text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="text-white">to Master Assessment</span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
                Packed with powerful features designed for modern educators who
                demand excellence and efficiency.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered Generation",
                  description:
                    "Leverage advanced AI to create unique, contextually relevant question papers from your source materials in seconds.",
                },
                {
                  icon: FileText,
                  title: "Flexible Patterns",
                  description:
                    "Choose from multiple question patterns or create custom configurations to match your exact requirements.",
                },
                {
                  icon: Zap,
                  title: "Instant Solutions",
                  description:
                    "Automatically generate companion solution guides alongside your question papers for comprehensive preparation.",
                },
                {
                  icon: Clock,
                  title: "Save Hours of Work",
                  description:
                    "What traditionally takes hours can now be done in minutes. Focus on teaching while QuestGen handles the paperwork.",
                },
                {
                  icon: Download,
                  title: "Export Ready PDFs",
                  description:
                    "Download professionally formatted question papers ready for printing or digital distribution.",
                },
                {
                  icon: RefreshCw,
                  title: "Regenerate with Ease",
                  description:
                    "Not satisfied? Regenerate papers with custom instructions until you get exactly what you need.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black hover:border-purple-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-pink-600/0 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2.5">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-black to-purple-950/20">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-pink-600/20 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid gap-0 lg:grid-cols-2 lg:gap-12">
              {/* Left side - Text content */}
              <div className="flex flex-col justify-center pb-12 lg:pb-0">
                <div className="inline-flex items-center gap-2 mb-6 w-fit px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10">
                  <Rocket className="h-4 w-4 text-purple-300" />
                  <span className="text-sm font-semibold text-purple-200">
                    THREE SIMPLE STEPS
                  </span>
                </div>

                <h2 className="font-playfair text-5xl sm:text-6xl font-bold mb-8 leading-tight">
                  From Upload to
                  <br />
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Export in Minutes
                  </span>
                </h2>

                <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                  QuestGen makes creating professional assessments effortless.
                  No technical knowledge required.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      num: "1",
                      title: "Upload Materials",
                      desc: "Drop in your PDFs, documents, or text files containing the source content",
                    },
                    {
                      num: "2",
                      title: "Configure Pattern",
                      desc: "Choose question types, set duration and marks, and customize to your needs",
                    },
                    {
                      num: "3",
                      title: "Generate & Export",
                      desc: "Get your complete question paper with optional solutions in seconds",
                    },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 font-bold text-lg text-white">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-white">
                          {step.title}
                        </h3>
                        <p className="text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Visual card showcase */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />

                  <div className="relative space-y-4">
                    {[
                      {
                        title: "Mathematics Final",
                        subtitle: "180 min · 100 marks",
                        progress: 75,
                        badge: "With Solutions",
                      },
                      {
                        title: "Physics Quiz",
                        subtitle: "60 min · 50 marks",
                        progress: 100,
                        badge: "Ready",
                      },
                      {
                        title: "Chemistry Test",
                        subtitle: "90 min · 75 marks",
                        progress: 85,
                        badge: "Generating",
                      },
                    ].map((paper, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/60 to-black p-6 backdrop-blur-sm"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white">
                              {paper.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              {paper.subtitle}
                            </div>
                          </div>
                          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                            {paper.badge}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full rounded-full bg-gray-800">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                              style={{ width: `${paper.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400">
                            {paper.progress}% completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-24 sm:py-32 bg-black">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full" />
          </div>

          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="font-playfair text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Trusted by Thousands
                </span>
                <br />
                <span className="text-white">of Educators Worldwide</span>
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: BarChart3, value: "10k+", label: "Active Users" },
                { icon: FileText, value: "50k+", label: "Papers Generated" },
                { icon: Lightbulb, value: "92%", label: "Time Saved" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black hover:border-purple-400/60 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Trust Section */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-black to-purple-950/20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black p-12 sm:p-16">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-transparent rounded-full blur-3xl -z-10" />

              <div className="mx-auto max-w-3xl text-center relative z-10">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10">
                  <Shield className="h-4 w-4 text-purple-300" />
                  <span className="text-sm font-semibold text-purple-200">
                    SECURE & RELIABLE
                  </span>
                </div>

                <h2 className="font-playfair text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Ready to Transform
                  </span>
                  <br />
                  <span className="text-white">Your Teaching Workflow?</span>
                </h2>

                <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                  Join educators and institutions using QuestGen to create
                  better assessments faster. Start generating professional
                  question papers today.
                </p>

                <a
                  href="/signin"
                  className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-8 text-lg font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 blur-xl group-hover:opacity-50 transition-all -z-10 rounded-xl" />
                  <span>Start Generating for Free</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
