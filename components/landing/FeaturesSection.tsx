import {
  Sparkles,
  FileText,
  Zap,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered generation",
    description:
      "Leverage advanced AI to create unique, contextually relevant question papers from your source materials in seconds.",
  },
  {
    icon: FileText,
    title: "Flexible patterns",
    description:
      "Choose from multiple question patterns or create custom configurations to match your exact requirements.",
  },
  {
    icon: Zap,
    title: "Instant solutions",
    description:
      "Automatically generate companion solution guides alongside your question papers for comprehensive preparation.",
  },
  {
    icon: Clock,
    title: "Save hours of work",
    description:
      "What traditionally takes hours can now be done in minutes. Focus on teaching while QuestGen handles the paperwork.",
  },
  {
    icon: Download,
    title: "Export ready PDFs",
    description:
      "Download professionally formatted question papers ready for printing or digital distribution.",
  },
  {
    icon: RefreshCw,
    title: "Regenerate with ease",
    description:
      "Not satisfied? Regenerate papers with custom instructions until you get exactly what you need.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32"
    >
      <div className="mb-16 text-center">
        <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[48px]">
          Everything you need to create
          <br />
          professional assessments
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
          From upload to export, QuestGen streamlines every step of your question
          paper creation workflow.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group rounded-[12px] border border-[#e5e5e5] bg-white p-8 transition-all duration-200 hover:border-[#d4d4d4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#404040] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
              <feature.icon className="h-6 w-6 text-white dark:text-[#171717]" />
            </div>
            <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
              {feature.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
