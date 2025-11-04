"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { isAuthenticated } from "@/lib/openrouter-auth";
import {
  getGenerateFormDraft,
  setGenerateFormDraft,
  clearGenerateFormDraft,
  createPaper,
  completePaper,
  type FileDescriptor,
} from "@/lib/storage";
import { generateQuestionPaper } from "@/lib/openrouter-client";
import { patternPresets } from "@/lib/pattern-presets";
import { FormField } from "@/components/generate/FormField";
import {
  PatternPresetsButton,
  PatternPresetsList,
} from "@/components/generate/PatternPresets";
import { FileUploadZone } from "@/components/generate/FileUploadZone";
import { UploadedFilesList } from "@/components/generate/UploadedFilesList";
import { GenerateButton } from "@/components/generate/GenerateButton";

interface UploadedFile {
  file: File;
  id: string;
}

const normalizePattern = (value: string): string =>
  value.replace(/\r\n/g, "\n").trim();

export default function Generate() {
  const router = useRouter();
  const [paperName, setPaperName] = useState("");
  const [paperPattern, setPaperPattern] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [arePresetsExpanded, setArePresetsExpanded] = useState(false);
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const paperPatternRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetsPanelId = "paper-pattern-presets-panel";
  const paperPatternDescribedBy =
    patternPresets.length > 0
      ? "paper-pattern-presets-heading paper-pattern-description"
      : "paper-pattern-description";

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);

  // Load form draft on mount
  useEffect(() => {
    const draft = getGenerateFormDraft();
    if (draft) {
      setPaperName(draft.paperName ?? "");
      const draftPattern = draft.paperPattern ?? "";
      setPaperPattern(draftPattern);
      setDuration(draft.duration ?? "");
      setTotalMarks(
        draft.totalMarks !== undefined && draft.totalMarks !== null
          ? String(draft.totalMarks)
          : "",
      );
      const matchedPreset = patternPresets.find(
        (preset) =>
          normalizePattern(preset.pattern) === normalizePattern(draftPattern),
      );
      setSelectedPresetId(matchedPreset ? matchedPreset.id : null);
      setArePresetsExpanded(Boolean(matchedPreset));
    }
  }, []);

  // Persist form values whenever they change
  useEffect(() => {
    // Only persist if at least one field has a value
    if (paperName || paperPattern || duration || totalMarks) {
      setGenerateFormDraft({
        paperName,
        paperPattern,
        duration,
        totalMarks,
      });
    }
  }, [paperName, paperPattern, duration, totalMarks]);

  const acceptedFileTypes = [".pdf", "image/*"];

  const applyPaperPattern = (nextPattern: string, presetId?: string | null) => {
    setPaperPattern(nextPattern);
    if (presetId !== undefined) {
      setSelectedPresetId(presetId);
      return;
    }
    const matchedPreset = patternPresets.find(
      (preset) =>
        normalizePattern(preset.pattern) === normalizePattern(nextPattern),
    );
    setSelectedPresetId(matchedPreset ? matchedPreset.id : null);
  };

  const handlePresetSelect = (preset: (typeof patternPresets)[0]) => {
    applyPaperPattern(preset.pattern, preset.id);
    setArePresetsExpanded(true);
  };

  const isFileTypeAccepted = (file: File): boolean => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return extension === ".pdf" || file.type.startsWith("image/");
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      if (isFileTypeAccepted(file)) {
        validFiles.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
      }
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Create file descriptors for storage
      const fileDescriptors: FileDescriptor[] = uploadedFiles.map((uf) => ({
        name: uf.file.name,
        size: uf.file.size,
        type: uf.file.type,
      }));

      // Create paper with "in_progress" status
      const paper = createPaper(
        paperName,
        paperPattern,
        duration,
        parseInt(totalMarks),
        fileDescriptors,
      );

      // Call OpenRouter API to generate the paper
      const result = await generateQuestionPaper({
        paperName,
        paperPattern,
        duration,
        totalMarks,
        files: uploadedFiles.map((uf) => uf.file),
      });

      if (!result.success) {
        toast.error("Unable to generate your paper", {
          description: result.error.includes("Primary model")
            ? "Both AI models are currently overloaded. Please try again in a few moments."
            : result.error,
        });
        return;
      }

      // Update paper status to completed and store content
      completePaper(paper.id, result.content);

      // Clear the form draft after successful generation
      clearGenerateFormDraft();

      // Navigate to the paper page
      router.push(`/paper/${paper.id}`);
    } catch (error) {
      console.error("Error generating paper:", error);
      toast.error("Unable to generate your paper", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        {/* Back Link */}
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

        {/* Header */}
        <header className="mb-16">
          <h1 className="font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            Question Paper Generator
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-[#666666] dark:text-[#888888]">
            Configure your question paper settings and upload source materials
          </p>
        </header>

        {/* Form */}
        <form className="space-y-10" onSubmit={handleGeneratePaper}>
          {/* Paper Name Input */}
          <FormField
            label="Paper Name"
            required
            htmlFor="paper-name"
            description="Give your question paper a descriptive name"
          >
            <input
              type="text"
              id="paper-name"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              placeholder="Mathematics Final Exam"
              required
              className="block h-[44px] w-full rounded-[6px] border border-[#e5e5e5] bg-white px-3 text-[15px] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-describedby="paper-name-description"
            />
          </FormField>

          {/* Paper Pattern Input */}
          <div className="group">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="paper-pattern"
                className="text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
              >
                Paper Pattern <span className="text-[#ef4444]">*</span>
              </label>
              {patternPresets.length > 0 && (
                <PatternPresetsButton
                  activePreset={
                    selectedPresetId
                      ? (patternPresets.find(
                          (p) => p.id === selectedPresetId,
                        ) ?? null)
                      : null
                  }
                  isExpanded={arePresetsExpanded}
                  onToggle={() => setArePresetsExpanded((prev) => !prev)}
                  panelId={presetsPanelId}
                />
              )}
            </div>
            {patternPresets.length > 0 && (
              <PatternPresetsList
                presets={patternPresets}
                selectedId={selectedPresetId}
                isExpanded={arePresetsExpanded}
                onSelect={handlePresetSelect}
                panelId={presetsPanelId}
                textareaRef={paperPatternRef}
              />
            )}
            <textarea
              id="paper-pattern"
              ref={paperPatternRef}
              value={paperPattern}
              onChange={(e) => applyPaperPattern(e.target.value)}
              placeholder="Section A: 10 MCQs (20 marks)&#x0A;Section B: 5 Short Answers (30 marks)&#x0A;Section C: 3 Long Answers (50 marks)"
              required
              rows={3}
              className="block w-full resize-y rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-3 text-[15px] leading-[1.6] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-describedby={paperPatternDescribedBy}
            />
            <p
              id="paper-pattern-description"
              className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]"
            >
              Specify the structure and format of your question paper
            </p>
          </div>

          {/* Duration Input */}
          <FormField
            label="Duration"
            required
            htmlFor="duration"
            description="Total time allocated for completing the paper"
          >
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="3 hours"
              required
              className="block h-[44px] w-full rounded-[6px] border border-[#e5e5e5] bg-white px-3 text-[15px] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-describedby="duration-description"
            />
          </FormField>

          {/* Total Marks Input */}
          <FormField
            label="Total Marks"
            required
            htmlFor="total-marks"
            description="Maximum marks for the entire question paper"
          >
            <input
              type="number"
              id="total-marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              placeholder="100"
              min="0"
              required
              className="block h-[44px] w-full rounded-[6px] border border-[#e5e5e5] bg-white px-3 text-[15px] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-describedby="total-marks-description"
            />
          </FormField>

          {/* File Upload Zone */}
          <div>
            <label className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]">
              Source Materials <span className="text-[#ef4444]">*</span>
            </label>
            <FileUploadZone
              onFilesSelected={handleFiles}
              acceptedTypes={acceptedFileTypes}
              isDragging={isDragging}
              onDragStateChange={setIsDragging}
              fileInputRef={fileInputRef}
            />
            <UploadedFilesList files={uploadedFiles} onRemove={removeFile} />
          </div>

          {/* Submit Button */}
          <GenerateButton isGenerating={isGenerating} />
        </form>
      </div>
    </div>
  );
}
