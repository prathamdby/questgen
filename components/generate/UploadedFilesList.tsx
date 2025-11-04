"use client";

import { X } from "lucide-react";
import { formatFileSize } from "@/lib/format-utils";
import { FileIcon } from "@/components/shared/FileIcon";

interface UploadedFile {
  file: File;
  id: string;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export function UploadedFilesList({ files, onRemove }: UploadedFilesListProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-5 space-y-2" role="list" aria-label="Uploaded files">
      {files.map((uploadedFile) => (
        <div
          key={uploadedFile.id}
          className="group/item flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
          role="listitem"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* File Icon */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#fafafa] dark:bg-[#171717]">
              <FileIcon filename={uploadedFile.file.name} />
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
              onRemove(uploadedFile.id);
            }}
            className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] text-[#737373] transition-all duration-150 hover:bg-[#fafafa] hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:hover:bg-[#171717] dark:hover:text-white dark:focus:ring-white"
            aria-label={`Remove ${uploadedFile.file.name}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
