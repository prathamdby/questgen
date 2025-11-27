import {
  Sparkles,
  FileText,
  Zap,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 sm:pb-32"
    >
      <div className="mb-16 text-center">
        <h2 className="font-sans text-[40px] font-[650] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[48px]">
          Precision tools for
          <br />
          modern assessments
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
          Engineered to streamline the entire lifecycle of question paper creation,
          from source material analysis to final distribution.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Sparkles className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Intelligent Orchestration"
          description="Advanced AI analyzes your source materials to construct contextually accurate questions that align with your curriculum's cognitive depth."
        />
        <FeatureCard
          icon={<FileText className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Adaptive Frameworks"
          description="Define granular constraints for question types, mark distribution, and difficulty levels. The system adapts to your specific pedagogical requirements."
        />
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Automated Key Generation"
          description="Simultaneously generate comprehensive solution guides and marking schemes, ensuring absolute alignment between questions and answers."
        />
        <FeatureCard
          icon={<Clock className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Workflow Acceleration"
          description="Transform a multi-hour manual drafting process into a streamlined efficient workflow. Reclaim your time for high-leverage teaching activities."
        />
        <FeatureCard
          icon={<Download className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Production-Ready Exports"
          description="One-click typesetting produces perfectly formatted PDFs ready for print or digital distribution, adhering to professional typographic standards."
        />
        <FeatureCard
          icon={<RefreshCw className="h-6 w-6 text-white dark:text-[#171717]" />}
          title="Iterative Refinement"
          description="Fine-tune results with precision. Regenerate specific sections or entire papers with adjusted parameters until the output meets your exact standards."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-[12px] border border-[#e5e5e5] bg-white p-8 transition-all duration-200 hover:border-[#d4d4d4] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#404040] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#171717] transition-transform duration-200 group-hover:scale-105 dark:bg-white">
        {icon}
      </div>
      <h3 className="mb-3 font-sans text-[21px] font-[600] tracking-[-0.01em] text-[#171717] dark:text-white">
        {title}
      </h3>
      <p className="text-[15px] leading-[1.6] text-[#666666] dark:text-[#888888]">
        {description}
      </p>
    </div>
  );
}
