"use client";

import { FileText, ChevronDown } from "lucide-react";
import { FileIcon } from "@/components/shared/FileIcon";
import { formatFileSize } from "@/lib/format-utils";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

interface SourceFilesSectionProps {
  files: UploadedFile[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function SourceFilesSection({
  files,
  isExpanded,
  onToggle,
}: SourceFilesSectionProps) {
  if (!files || files.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white p-4 text-left transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
        aria-expanded={isExpanded}
        aria-controls="files-content"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#737373]" aria-hidden="true" />
          <span className="text-[14px] font-[500] text-[#171717] dark:text-white">
            Source Files ({files.length})
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#737373] transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div id="files-content" className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#fafafa] dark:bg-[#171717]">
                  <FileIcon filename={file.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-[500] text-[#171717] dark:text-white">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-[#737373]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

