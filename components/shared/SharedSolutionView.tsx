import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { MetadataGrid } from "@/components/paper/MetadataGrid";

interface SharedSolutionViewProps {
  solution: {
    content: string;
    createdAt: Date;
    paper: {
      title: string;
      pattern: string;
      duration: string;
      totalMarks: number;
    };
  };
  ownerName: string;
}

export function SharedSolutionView({
  solution,
  ownerName,
}: SharedSolutionViewProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="mb-4 flex items-center gap-2 text-[13px] text-[#737373]">
          <span>Shared by {ownerName}</span>
          <span>•</span>
          <span>Solution</span>
        </div>

        <header className="mb-12">
          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {solution.paper.title}
          </h1>

          <MetadataGrid
            pattern={solution.paper.pattern}
            duration={solution.paper.duration}
            totalMarks={solution.paper.totalMarks}
          />
        </header>

        <MarkdownPreview content={solution.content} />
      </div>
    </div>
  );
}
