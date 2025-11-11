import { FileText, Image as ImageIcon, File } from "lucide-react";

interface FileIconProps {
  filename: string;
  className?: string;
}

export function FileIcon({ filename, className = "h-4 w-4" }: FileIconProps) {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "pdf":
      return (
        <FileText
          className={`${className} text-[#ef4444]`}
          aria-hidden="true"
        />
      );
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "bmp":
    case "ico":
      return (
        <ImageIcon
          className={`${className} text-[#8b5cf6]`}
          aria-hidden="true"
        />
      );
    case "docx":
    case "doc":
      return (
        <FileText
          className={`${className} text-[#2b579a]`}
          aria-hidden="true"
        />
      );
    case "md":
    case "txt":
      return (
        <FileText
          className={`${className} text-[#737373]`}
          aria-hidden="true"
        />
      );
    case "xls":
    case "xlsx":
      return (
        <FileText
          className={`${className} text-[#217346]`}
          aria-hidden="true"
        />
      );
    default:
      return (
        <File className={`${className} text-[#737373]`} aria-hidden="true" />
      );
  }
}
