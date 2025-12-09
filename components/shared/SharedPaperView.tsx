"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MarkdownPreview } from "@/components/paper/MarkdownPreview";
import { MetadataGrid } from "@/components/paper/MetadataGrid";
import { SharedPaperActionButtons } from "@/components/shared/SharedPaperActionButtons";
import { exportToPDF, type PaperData } from "@/lib/pdf-export-client";

interface SharedPaperViewProps {
  paper: {
    title: string;
    pattern: string;
    duration: string;
    totalMarks: number;
    content: string;
    createdAt: Date;
  };
  ownerName: string;
}

export function SharedPaperView({ paper, ownerName }: SharedPaperViewProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (!paper.content) {
        throw new Error("Paper content is unavailable");
      }

      const paperData: PaperData = {
        title: paper.title,
        pattern: paper.pattern,
        duration: paper.duration,
        totalMarks: paper.totalMarks,
        content: paper.content,
        createdAt: paper.createdAt.toISOString(),
      };

      await exportToPDF(paperData);
      toast.success("Paper exported successfully");
    } catch (error) {
      toast.error("Unable to export paper", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="mb-4 flex items-center gap-2 text-[13px] text-[#737373]">
          <span>Shared by {ownerName}</span>
          <span>•</span>
          <span>Question Paper</span>
        </div>

        <header className="mb-12">
          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {paper.title}
          </h1>

          <MetadataGrid
            pattern={paper.pattern}
            duration={paper.duration}
            totalMarks={paper.totalMarks}
          />

          <div className="mt-8">
            <SharedPaperActionButtons
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </header>

        <MarkdownPreview content={paper.content} />
      </div>
    </div>
  );
}
