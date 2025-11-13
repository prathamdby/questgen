"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { patternPresets } from "@/lib/pattern-presets";
import { pastPaperStrategies } from "@/lib/past-paper-strategies";
import {
  getAcceptedFileTypesArray,
  isSupportedMimeType,
  getMimeTypeFromExtension,
} from "@/lib/file-types";
import { FormField } from "@/components/generate/FormField";
import {
  PatternPresetsButton,
  PatternPresetsList,
} from "@/components/generate/PatternPresets";
import { PastPaperStrategyList } from "@/components/generate/PastPaperStrategyList";
import { FileUploadZone } from "@/components/generate/FileUploadZone";
import { UploadedFilesList } from "@/components/generate/UploadedFilesList";
import { GenerateButton } from "@/components/generate/GenerateButton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface UploadedFile {
  file: File;
  id: string;
}

type GenerationMode = "from_scratch" | "past_papers";

const normalizePattern = (value: string): string =>
  value.replace(/\r\n/g, "\n").trim();

export default function Generate() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [generationMode, setGenerationMode] =
    useState<GenerationMode>("from_scratch");
  const [paperName, setPaperName] = useState("");
  const [paperPattern, setPaperPattern] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [arePresetsExpanded, setArePresetsExpanded] = useState(false);
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [sourceFiles, setSourceFiles] = useState<UploadedFile[]>([]);
  const [pastPaperFiles, setPastPaperFiles] = useState<UploadedFile[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState(
    pastPaperStrategies[0].id,
  );
  const [shouldGenerateSolution, setShouldGenerateSolution] = useState(false);
  const [isSourceDragging, setIsSourceDragging] = useState(false);
  const [isPastPaperDragging, setIsPastPaperDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const paperPatternRef = useRef<HTMLTextAreaElement>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const pastPaperFileInputRef = useRef<HTMLInputElement>(null);
  const presetsPanelId = "paper-pattern-presets-panel";
  const paperPatternDescribedBy =
    patternPresets.length > 0
      ? "paper-pattern-presets-heading paper-pattern-description"
      : "paper-pattern-description";

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const acceptedFileTypes = getAcceptedFileTypesArray();

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
    if (isSupportedMimeType(file.type)) {
      return true;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension) {
      const mimeType = getMimeTypeFromExtension(extension);
      return mimeType ? isSupportedMimeType(mimeType) : false;
    }
    return false;
  };

  const handleSourceFiles = (files: FileList | null) => {
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

    setSourceFiles((prev) => [...prev, ...validFiles]);
  };

  const handlePastPaperFiles = (files: FileList | null) => {
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

    setPastPaperFiles((prev) => [...prev, ...validFiles]);
  };

  const removeSourceFile = (id: string) => {
    setSourceFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removePastPaperFile = (id: string) => {
    setPastPaperFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGenerating) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

    if (generationMode === "past_papers" && pastPaperFiles.length === 0) {
      toast.error("Past papers required", {
        description: "Please upload at least one past paper file.",
      });
      return;
    }

    const allFiles = [...sourceFiles, ...pastPaperFiles];

    const oversizedFiles = allFiles.filter((f) => f.file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error("File size exceeded", {
        description: `${oversizedFiles[0].file.name} exceeds 10MB limit.`,
      });
      return;
    }

    const totalSize = allFiles.reduce((sum, f) => sum + f.file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("Total size exceeded", {
        description: `Total file size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit.`,
      });
      return;
    }

    setIsGenerating(true);

    try {
      const sourceFilesData = await Promise.all(
        sourceFiles.map(async (uf) => ({
          name: uf.file.name,
          type: uf.file.type,
          size: uf.file.size,
          data: await fileToBase64(uf.file),
          role: "source" as const,
        })),
      );

      const pastPaperFilesData = await Promise.all(
        pastPaperFiles.map(async (uf) => ({
          name: uf.file.name,
          type: uf.file.type,
          size: uf.file.size,
          data: await fileToBase64(uf.file),
          role: "past_paper" as const,
        })),
      );

      const response = await fetch("/api/papers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperName,
          paperPattern,
          duration,
          totalMarks,
          generationMode,
          strategy: generationMode === "past_papers" ? selectedStrategy : null,
          sourceFiles: sourceFilesData,
          pastPaperFiles: pastPaperFilesData,
          generateSolution: shouldGenerateSolution,
        }),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        toast.error("Rate limit exceeded", {
          description: `You can generate 2 papers per minute. Please wait ${retryAfter || "60"} seconds.`,
        });
        return;
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.solutionError) {
        toast.warning("Solution unavailable", {
          description:
            "Your paper is ready, but the companion solution could not be generated. Please try regenerating the solution from the paper view.",
        });
      }

      router.push(`/paper/${result.paperId}`);
    } catch (error) {
      console.error("Generation error:", error);
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

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result.split(",")[1]);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

        <form className="space-y-10" onSubmit={handleGeneratePaper}>
          <Tabs
            defaultValue="from_scratch"
            value={generationMode}
            onValueChange={(value) =>
              setGenerationMode(value as GenerationMode)
            }
          >
            <TabsList ariaLabel="Generation mode">
              <TabsTrigger value="from_scratch">From Scratch</TabsTrigger>
              <TabsTrigger value="past_papers">Past Papers</TabsTrigger>
            </TabsList>

            <div className="mt-10 space-y-10">
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

              <TabsContent value="from_scratch">
                <div>
                  <label className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]">
                    Source Materials <span className="text-[#ef4444]">*</span>
                  </label>
                  <FileUploadZone
                    onFilesSelected={handleSourceFiles}
                    acceptedTypes={acceptedFileTypes}
                    isDragging={isSourceDragging}
                    onDragStateChange={setIsSourceDragging}
                    fileInputRef={sourceFileInputRef}
                  />
                  <UploadedFilesList
                    files={sourceFiles}
                    onRemove={removeSourceFile}
                  />
                </div>
              </TabsContent>

              <TabsContent value="past_papers" className="space-y-10">
                <div>
                  <label
                    htmlFor="past-paper-strategy"
                    className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
                  >
                    Analysis Strategy <span className="text-[#ef4444]">*</span>
                  </label>
                  <PastPaperStrategyList
                    strategies={pastPaperStrategies}
                    selectedId={selectedStrategy}
                    onSelect={setSelectedStrategy}
                  />
                  <p className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
                    Choose how QuestGen should analyze past papers to generate
                    your new paper
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]">
                    Past Papers <span className="text-[#ef4444]">*</span>
                  </label>
                  <FileUploadZone
                    onFilesSelected={handlePastPaperFiles}
                    acceptedTypes={acceptedFileTypes}
                    isDragging={isPastPaperDragging}
                    onDragStateChange={setIsPastPaperDragging}
                    fileInputRef={pastPaperFileInputRef}
                  />
                  <UploadedFilesList
                    files={pastPaperFiles}
                    onRemove={removePastPaperFile}
                  />
                  <p className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
                    Upload past examination papers for analysis and pattern
                    extraction
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]">
                    Source Materials
                  </label>
                  <FileUploadZone
                    onFilesSelected={handleSourceFiles}
                    acceptedTypes={acceptedFileTypes}
                    isDragging={isSourceDragging}
                    onDragStateChange={setIsSourceDragging}
                    fileInputRef={sourceFileInputRef}
                  />
                  <UploadedFilesList
                    files={sourceFiles}
                    onRemove={removeSourceFile}
                  />
                  <p className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
                    Optional: Add reference materials for question content
                  </p>
                </div>
              </TabsContent>

              <div className="flex flex-wrap items-start justify-between gap-4 rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-5 dark:border-[#262626] dark:bg-[#0f0f0f]">
                <div className="min-w-[220px] flex-1">
                  <p
                    id="generate-solution-label"
                    className="text-[14px] font-[500] tracking-[-0.01em] text-[#171717] dark:text-white"
                  >
                    Generate companion solution
                  </p>
                  <p
                    id="generate-solution-description"
                    className="mt-2 text-[13px] leading-[1.5] text-[#595959] dark:text-[#8c8c8c]"
                  >
                    When enabled, QuestGen will craft a step-by-step answer set
                    strictly from your uploaded materials and the generated
                    paper.
                  </p>
                </div>
                <Switch
                  checked={shouldGenerateSolution}
                  onCheckedChange={setShouldGenerateSolution}
                  ariaLabelledBy="generate-solution-label"
                  ariaDescribedBy="generate-solution-description"
                />
              </div>
            </div>
          </Tabs>

          <GenerateButton isGenerating={isGenerating} />
        </form>
      </div>
    </div>
  );
}
