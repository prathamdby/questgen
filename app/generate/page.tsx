"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/openrouter-auth";
import {
  getGenerateFormDraft,
  setGenerateFormDraft,
  clearGenerateFormDraft,
} from "@/lib/storage";

interface UploadedFile {
  file: File;
  id: string;
}

export default function Home() {
  const router = useRouter();
  const [paperName, setPaperName] = useState("");
  const [paperPattern, setPaperPattern] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setPaperName(draft.paperName);
      setPaperPattern(draft.paperPattern);
      setDuration(draft.duration);
      setTotalMarks(draft.totalMarks);
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

  const acceptedFileTypes = [".pdf", ".md", ".docx", ".txt", "image/*"];

  const isFileTypeAccepted = (file: File): boolean => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return (
      extension === ".pdf" ||
      extension === ".md" ||
      extension === ".docx" ||
      extension === ".txt" ||
      file.type.startsWith("image/")
    );
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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // TODO: Implement paper generation logic
      console.log("Generating paper with:", {
        paperName,
        paperPattern,
        duration,
        totalMarks,
        files: uploadedFiles,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear the form draft after successful generation
      clearGenerateFormDraft();
    } catch (error) {
      console.error("Error generating paper:", error);
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
          <svg
            className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
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
          <div className="group">
            <label
              htmlFor="paper-name"
              className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
            >
              Paper Name <span className="text-[#ef4444]">*</span>
            </label>
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
            <p
              id="paper-name-description"
              className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]"
            >
              Give your question paper a descriptive name
            </p>
          </div>

          {/* Paper Pattern Input */}
          <div className="group">
            <label
              htmlFor="paper-pattern"
              className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
            >
              Paper Pattern <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              id="paper-pattern"
              value={paperPattern}
              onChange={(e) => setPaperPattern(e.target.value)}
              placeholder="Section A: 10 MCQs (20 marks)&#x0A;Section B: 5 Short Answers (30 marks)&#x0A;Section C: 3 Long Answers (50 marks)"
              required
              rows={3}
              className="block w-full resize-y rounded-[6px] border border-[#e5e5e5] bg-white px-3 py-3 text-[15px] leading-[1.6] text-[#171717] placeholder-[#a3a3a3] transition-all duration-150 hover:border-[#d4d4d4] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:text-white dark:placeholder-[#666666] dark:hover:border-[#525252] dark:focus:border-white dark:focus:ring-white"
              aria-describedby="paper-pattern-description"
            />
            <p
              id="paper-pattern-description"
              className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]"
            >
              Specify the structure and format of your question paper
            </p>
          </div>

          {/* Duration Input */}
          <div className="group">
            <label
              htmlFor="duration"
              className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
            >
              Duration <span className="text-[#ef4444]">*</span>
            </label>
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
            <p
              id="duration-description"
              className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]"
            >
              Total time allocated for completing the paper
            </p>
          </div>

          {/* Total Marks Input */}
          <div className="group">
            <label
              htmlFor="total-marks"
              className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
            >
              Total Marks <span className="text-[#ef4444]">*</span>
            </label>
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
            <p
              id="total-marks-description"
              className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]"
            >
              Maximum marks for the entire question paper
            </p>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]">
              Source Materials <span className="text-[#ef4444]">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed px-6 py-16 transition-all duration-200 ${
                isDragging
                  ? "border-[#171717] bg-[#fafafa] dark:border-white dark:bg-[#0a0a0a]"
                  : "border-[#e5e5e5] bg-[#fafafa] hover:border-[#d4d4d4] hover:bg-[#f5f5f5] dark:border-[#333333] dark:bg-[#0a0a0a] dark:hover:border-[#525252] dark:hover:bg-[#171717]"
              }`}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {/* Upload Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black">
                <svg
                  className="h-6 w-6 text-[#737373] transition-colors duration-200 group-hover:text-[#171717] dark:group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <p className="mb-2 text-[15px] font-[500] text-[#171717] dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-[13px] text-[#737373]">
                PDF, MD, DOCX, TXT, or Images
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInputChange}
              required
              className="sr-only"
              aria-label="File input"
            />

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div
                className="mt-5 space-y-2"
                role="list"
                aria-label="Uploaded files"
              >
                {uploadedFiles.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    className="group/item flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
                    role="listitem"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {/* File Icon */}
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#fafafa] dark:bg-[#171717]">
                        <svg
                          className="h-4 w-4 text-[#737373]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>

                      {/* File Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-[500] text-[#171717] dark:text-white">
                          {uploadedFile.file.name}
                        </p>
                        <p className="mt-0.5 text-[12px] tabular-nums text-[#737373]">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(uploadedFile.id);
                      }}
                      className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] text-[#737373] transition-all duration-150 hover:bg-[#fafafa] hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:hover:bg-[#171717] dark:hover:text-white dark:focus:ring-white"
                      aria-label={`Remove ${uploadedFile.file.name}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className={`group flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] px-6 text-[15px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isGenerating
                  ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
                  : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  {/* Loading Spinner */}
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Generating Paper...</span>
                </>
              ) : (
                <>
                  <span>Generate Paper</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Loading Feedback */}
            {isGenerating && (
              <p className="mt-3 text-center text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
                This may take a few moments. Please don't close this page.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
