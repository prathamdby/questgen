/**
 * Centralized file type definitions and utilities for Gemini API file handling
 */

// Supported MIME types by category
export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const SUPPORTED_DOCUMENT_MIME_TYPES = [
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const SUPPORTED_PDF_MIME_TYPES = ["application/pdf"];

// All supported MIME types
export const ALL_SUPPORTED_MIME_TYPES = [
  ...SUPPORTED_PDF_MIME_TYPES,
  ...SUPPORTED_IMAGE_MIME_TYPES,
  ...SUPPORTED_DOCUMENT_MIME_TYPES,
];

// File extension to MIME type mapping
export const EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  txt: "text/plain",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/**
 * Check if a MIME type is supported
 */
export function isSupportedMimeType(mimeType: string): boolean {
  return ALL_SUPPORTED_MIME_TYPES.includes(mimeType);
}

/**
 * Get file category based on MIME type
 */
export function getFileCategory(
  mimeType: string,
): "pdf" | "image" | "document" | "unknown" {
  if (SUPPORTED_PDF_MIME_TYPES.includes(mimeType)) return "pdf";
  if (SUPPORTED_IMAGE_MIME_TYPES.includes(mimeType)) return "image";
  if (SUPPORTED_DOCUMENT_MIME_TYPES.includes(mimeType)) return "document";
  return "unknown";
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string | undefined {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  return EXTENSION_TO_MIME_TYPE[normalized];
}

/**
 * Get display name for file category
 */
export function getCategoryDisplayName(
  category: "pdf" | "image" | "document" | "unknown",
): string {
  switch (category) {
    case "pdf":
      return "PDF";
    case "image":
      return "Image";
    case "document":
      return "Document";
    default:
      return "File";
  }
}

/**
 * Get accepted file types array for HTML input accept attribute
 */
export function getAcceptedFileTypesArray(): string[] {
  return [
    ".pdf",
    "image/*",
    ".txt",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ];
}
