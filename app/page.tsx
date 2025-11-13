import type { Metadata } from "next";
import {
  Sparkles,
  FileText,
  Zap,
  Clock,
  Shield,
  BookOpen,
  CheckCircle2,
  Target,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
  ArrowRight,
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
    <div className="relative min-h-screen overflow-hidden bg-[#ff0000] dark:bg-[#cc0000]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#ff3333] opacity-[0.2] blur-[100px] dark:opacity-[0.3]"></div>
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#ff6666] opacity-[0.15] blur-[80px] dark:opacity-[0.25]"></div>
      </div>

      <LandingHeader />

      <main className="relative z-10">
        <HeroSection />

        <section
          id="features"
          className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32"
        >
          <div className="mb-16 text-center">
            <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-[48px]">
              Everything you need to create
              <br />
              professional assessments
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-white/80">
              From upload to export, QuestGen streamlines every step of your
              question paper creation workflow
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                AI-powered generation
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                Leverage advanced AI to create unique, contextually relevant
                question papers from your source materials in seconds.
              </p>
            </div>

            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <FileText className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                Flexible patterns
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                Choose from multiple question patterns or create custom
                configurations to match your exact requirements.
              </p>
            </div>

            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <Zap className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                Instant solutions
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                Automatically generate companion solution guides alongside your
                question papers for comprehensive preparation.
              </p>
            </div>

            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <Clock className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                Save hours of work
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                What traditionally takes hours can now be done in minutes. Focus
                on teaching while QuestGen handles the paperwork.
              </p>
            </div>

            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <Download className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                Export ready PDFs
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                Download professionally formatted question papers ready for
                printing or digital distribution.
              </p>
            </div>

            <div className="group rounded-[12px] border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/15">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-white transition-transform duration-200 group-hover:scale-105">
                <RefreshCw className="h-6 w-6 text-[#ff0000]" />
              </div>
              <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-white">
                Regenerate with ease
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80">
                Not satisfied? Regenerate papers with custom instructions until
                you get exactly what you need.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
          <div className="overflow-hidden rounded-[16px] border border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-12 sm:p-16">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[12px] font-[600] text-white/80">
                  <Target className="h-3 w-3 text-white" />
                  <span>SIMPLE WORKFLOW</span>
                </div>
                <h2 className="mb-6 font-sans text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-[40px]">
                  Three steps to perfect question papers
                </h2>
                <p className="mb-8 text-[15px] leading-[1.6] text-white/80">
                  QuestGen makes creating professional assessments effortless.
                  No technical knowledge required.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-white text-[15px] font-[600] text-[#ff0000]">
                      1
                    </div>
                    <div>
                      <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-white">
                        Upload your materials
                      </h3>
                      <p className="text-[15px] leading-[1.6] text-white/80">
                        Drop in your PDFs, documents, or text files containing
                        the source content
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-white text-[15px] font-[600] text-[#ff0000]">
                      2
                    </div>
                    <div>
                      <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-white">
                        Configure your pattern
                      </h3>
                      <p className="text-[15px] leading-[1.6] text-white/80">
                        Choose question types, set duration and marks, and
                        customize to your needs
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-white text-[15px] font-[600] text-[#ff0000]">
                      3
                    </div>
                    <div>
                      <h3 className="mb-1 text-[17px] font-[600] tracking-[-0.01em] text-white">
                        Generate and export
                      </h3>
                      <p className="text-[15px] leading-[1.6] text-white/80">
                        Get your complete question paper with optional solutions
                        in seconds
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center bg-white/5 p-12 sm:p-16">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-[#ff4d4d] to-[#ff1a1a] opacity-20 blur-xl"></div>
                  <div className="relative space-y-4">
                    <div className="rounded-[10px] border border-white/20 bg-white/90 p-6 shadow-[0_4px_12px_rgb(0,0,0,0.06)]">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ff0000]">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-[15px] font-[600] text-[#171717]">
                            Mathematics Final
                          </div>
                          <div className="text-[13px] text-[#666666]">
                            180 min · 100 marks
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-[#ffe5e5]">
                          <div className="h-2 w-3/4 rounded-full bg-[#ff0000]"></div>
                        </div>
                        <div className="text-[13px] text-[#666666]">
                          Generated with solutions
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[10px] border border-white/20 bg-white/90 p-6 shadow-[0_4px_12px_rgb(0,0,0,0.06)]">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ff0000]">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-[15px] font-[600] text-[#171717]">
                            Physics Quiz
                          </div>
                          <div className="text-[13px] text-[#666666]">
                            60 min · 50 marks
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-[#ffe5e5]">
                          <div className="h-2 w-full rounded-full bg-[#ff0000]"></div>
                        </div>
                        <div className="text-[13px] text-[#666666]">
                          Ready for export
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
          <div className="mb-16 text-center">
            <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-[48px]">
              Built for educators,
              <br />
              trusted by institutions
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-white/80">
              Join thousands of educators who have already transformed their
              assessment creation process
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-white">
                <Users className="h-8 w-8 text-[#ff0000]" />
              </div>
              <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-white">
                10k+
              </div>
              <p className="text-[15px] text-white/80">
                Educators using QuestGen
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-white">
                <FileText className="h-8 w-8 text-[#ff0000]" />
              </div>
              <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-white">
                50k+
              </div>
              <p className="text-[15px] text-white/80">
                Question papers generated
              </p>
            </div>

            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[12px] bg-white">
                <TrendingUp className="h-8 w-8 text-[#ff0000]" />
              </div>
              <div className="mb-2 font-sans text-[48px] font-[650] tracking-[-0.03em] text-white">
                92%
              </div>
              <p className="text-[15px] text-white/80">Time saved on average</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32">
          <div className="overflow-hidden rounded-[16px] border border-white/20 bg-gradient-to-br from-[#ff3333] to-[#b30000] p-12 sm:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-[600] text-white/70 backdrop-blur-sm">
                <Shield className="h-3 w-3 text-white" />
                <span>SECURE & RELIABLE</span>
              </div>
              <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-[56px]">
                Ready to transform your workflow?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.6] text-white/80">
                Join educators and institutions using QuestGen to create better
                assessments faster. Start generating professional question
                papers today.
              </p>
              <a
                href="/signin"
                className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-white px-8 text-[17px] font-[600] text-[#b30000] transition-all duration-150 hover:bg-[#ffe5e5] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#b30000] active:scale-[0.98]"
                style={{ touchAction: "manipulation" }}
              >
                <span>Start generating</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
