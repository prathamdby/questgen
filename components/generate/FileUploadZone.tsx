"use client";

import { Upload } from "lucide-react";

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList | null) => void;
  acceptedTypes: string[];
  isDragging: boolean;
  onDragStateChange: (dragging: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function FileUploadZone({
  onFilesSelected,
  acceptedTypes,
  isDragging,
  onDragStateChange,
  fileInputRef,
}: FileUploadZoneProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragStateChange(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragStateChange(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragStateChange(false);
    onFilesSelected(e.dataTransfer.files);
  };

  return (
    <>
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
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-black">
          <Upload
            className="h-6 w-6 text-[#737373] transition-colors duration-200 group-hover:text-[#171717] dark:group-hover:text-white"
            aria-hidden="true"
          />
        </div>

        <p className="mb-2 text-[15px] font-[500] text-[#171717] dark:text-white">
          Click to upload or drag and drop
        </p>
        <p className="text-[13px] text-[#737373]">
          PDF, Images, or Documents (DOCX, XLSX, TXT)
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => onFilesSelected(e.target.files)}
        className="sr-only"
        aria-label="File input"
      />
    </>
  );
}
