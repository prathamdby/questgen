"use client";

import { cleanMarkdownContent } from "@/lib/transformers";

export interface PaperData {
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  content: string;
  createdAt: string;
}

export interface SolutionData {
  paperTitle: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  content: string;
  createdAt: string;
}

function generateHTMLTemplate(
  title: string,
  pattern: string,
  duration: string,
  totalMarks: number,
  htmlContent: string,
  createdAt: string,
): string {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const escapeHtml = (text: string) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const escapedTitle = escapeHtml(title);
  const escapedPattern = escapeHtml(pattern);
  const escapedDuration = escapeHtml(duration);
  const escapedTotalMarks = escapeHtml(String(totalMarks));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    /* Apple/Vercel-inspired design system */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --color-foreground: #171717;
      --color-foreground-muted: #525252;
      --color-foreground-subtle: #737373;
      --color-border: #e5e5e5;
      --color-border-subtle: #f5f5f5;
      --color-background: #ffffff;
      --color-background-subtle: #fafafa;
      --color-accent: #0070f3;

      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;

      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      --spacing-2xl: 3rem;
      --spacing-3xl: 4rem;

      --radius-sm: 4px;
      --radius-md: 6px;
      --radius-lg: 8px;
    }

    @page {
      size: A4;
      margin: 2cm 2.5cm;

      @bottom-center {
        content: counter(page) " / " counter(pages);
        font-family: var(--font-sans);
        font-size: 10px;
        color: var(--color-foreground-subtle);
      }
    }

    body {
      font-family: var(--font-sans);
      color: var(--color-foreground);
      background: var(--color-background);
      line-height: 1.7;
      font-size: 11pt;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Header Section */
    .header {
      margin-bottom: var(--spacing-3xl);
      padding-bottom: var(--spacing-xl);
      border-bottom: 1px solid var(--color-border);
      page-break-after: avoid;
    }

    .header-meta {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
      margin-bottom: var(--spacing-md);
      font-size: 9pt;
      color: var(--color-foreground-subtle);
    }

    .header-meta-item {
      display: inline-flex;
      align-items: center;
    }

    .header-meta-divider {
      width: 3px;
      height: 3px;
      background: var(--color-foreground-subtle);
      border-radius: 50%;
      opacity: 0.4;
    }

    .title {
      font-size: 32pt;
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-foreground);
      margin-bottom: var(--spacing-xl);
      page-break-after: avoid;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-xl);
    }

    .metadata-item {
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-md) var(--spacing-lg);
      page-break-inside: avoid;
    }

    .metadata-label {
      font-size: 9pt;
      font-weight: 500;
      color: var(--color-foreground-subtle);
      margin-bottom: var(--spacing-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metadata-value {
      font-size: 11pt;
      font-weight: 500;
      color: var(--color-foreground);
    }

    /* Content Section */
    .content {
      max-width: 100%;
    }

    /* Typography */
    .content h1,
    .content h2,
    .content h3,
    .content h4,
    .content h5,
    .content h6 {
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--color-foreground);
      margin-top: var(--spacing-2xl);
      margin-bottom: var(--spacing-md);
      page-break-after: avoid;
    }

    .content h1 {
      font-size: 24pt;
      line-height: 1.2;
      margin-top: var(--spacing-3xl);
    }

    .content h2 {
      font-size: 18pt;
      line-height: 1.3;
    }

    .content h3 {
      font-size: 14pt;
      line-height: 1.4;
    }

    .content h4 {
      font-size: 12pt;
      line-height: 1.5;
    }

    .content p {
      margin-bottom: var(--spacing-lg);
      color: var(--color-foreground-muted);
      orphans: 3;
      widows: 3;
    }

    .content ul,
    .content ol {
      margin-bottom: var(--spacing-lg);
      padding-left: var(--spacing-xl);
    }

    .content li {
      margin-bottom: var(--spacing-sm);
      color: var(--color-foreground-muted);
      page-break-inside: avoid;
    }

    .content li::marker {
      color: var(--color-foreground-subtle);
    }

    .content strong {
      font-weight: 600;
      color: var(--color-foreground);
    }

    .content em {
      font-style: italic;
    }

    .content a {
      color: var(--color-accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    .content a:hover {
      border-bottom-color: var(--color-accent);
    }

    /* Code blocks */
    .content code {
      font-family: var(--font-mono);
      font-size: 9.5pt;
      background: var(--color-background-subtle);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      color: var(--color-foreground);
    }

    .content pre {
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
      overflow-x: auto;
      page-break-inside: avoid;
    }

    .content pre code {
      background: transparent;
      padding: 0;
      border: none;
      font-size: 9pt;
      line-height: 1.6;
    }

    /* Tables */
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: var(--spacing-lg);
      font-size: 10pt;
      page-break-inside: avoid;
    }

    .content table th,
    .content table td {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-border);
      text-align: left;
    }

    .content table th {
      background: var(--color-background-subtle);
      font-weight: 600;
      color: var(--color-foreground);
    }

    .content table td {
      color: var(--color-foreground-muted);
    }

    /* Blockquotes */
    .content blockquote {
      margin: var(--spacing-lg) 0;
      padding-left: var(--spacing-lg);
      border-left: 3px solid var(--color-border);
      color: var(--color-foreground-muted);
      font-style: italic;
      page-break-inside: avoid;
    }

    /* Horizontal rule */
    .content hr {
      border: none;
      border-top: 1px solid var(--color-border);
      margin: var(--spacing-2xl) 0;
    }

    /* Print optimization */
    @media print {
      body {
        font-size: 11pt;
      }

      .header,
      .metadata-item,
      .content h1,
      .content h2,
      .content h3,
      .content h4,
      .content h5,
      .content h6,
      .content pre,
      .content table,
      .content blockquote {
        page-break-inside: avoid;
      }

      .content a {
        color: var(--color-foreground);
        border-bottom: none;
      }

      .content a::after {
        content: " (" attr(href) ")";
        font-size: 9pt;
        color: var(--color-foreground-subtle);
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-meta">
      <span class="header-meta-item">QuestGen Quest</span>
      <span class="header-meta-divider"></span>
      <span class="header-meta-item">Generated on ${formattedDate}</span>
    </div>

    <h1 class="title">${escapedTitle}</h1>

    <div class="metadata-grid">
      <div class="metadata-item">
        <div class="metadata-label">Pattern</div>
        <div class="metadata-value">${escapedPattern}</div>
      </div>

      <div class="metadata-item">
        <div class="metadata-label">Duration</div>
        <div class="metadata-value">${escapedDuration}</div>
      </div>

      <div class="metadata-item">
        <div class="metadata-label">Total Marks</div>
        <div class="metadata-value">${escapedTotalMarks}</div>
      </div>
    </div>
  </div>

  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
  `.trim();
}

function waitForFonts(window: Window): Promise<void> {
  return new Promise((resolve) => {
    // Wait for window to fully load first
    if (window.document.readyState === "complete") {
      checkFonts();
    } else {
      window.addEventListener("load", checkFonts);
    }

    function checkFonts() {
      if (window.document.fonts && window.document.fonts.ready) {
        window.document.fonts.ready.then(() => {
          setTimeout(resolve, 100);
        });
      } else {
        setTimeout(resolve, 500);
      }
    }
  });
}

export async function exportToPDF(paperData: PaperData): Promise<void> {
  if (!paperData.title || !paperData.content) {
    throw new Error("Missing required fields: title and content are required");
  }

  let markedParser: (typeof import("marked"))["marked"];
  try {
    markedParser = (await import("marked")).marked;
  } catch (error) {
    throw new Error("Failed to load PDF export library. Please try again.");
  }

  const cleanedContent = cleanMarkdownContent(paperData.content.trim());

  // Convert markdown to HTML
  const htmlContent = await markedParser.parse(cleanedContent, {
    gfm: true,
    breaks: true,
  });

  // Generate HTML template
  const html = generateHTMLTemplate(
    paperData.title,
    paperData.pattern,
    paperData.duration,
    paperData.totalMarks,
    htmlContent,
    paperData.createdAt,
  );

  // Open new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error(
      "Popup blocked. Please allow popups for this site to export PDFs.",
    );
  }

  // Write HTML to window
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for fonts to load before printing
  await waitForFonts(printWindow);

  printWindow.focus();
  printWindow.print();

  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      printWindow.close();
    }
  }, 1000);
}

/**
 * Export solution to PDF
 * Similar to paper export but with "Solution:" prefix in title
 */
export async function exportSolutionToPDF(
  solutionData: SolutionData,
): Promise<void> {
  if (!solutionData.paperTitle || !solutionData.content) {
    throw new Error(
      "Missing required fields: paperTitle and content are required",
    );
  }

  let markedParser: (typeof import("marked"))["marked"];
  try {
    markedParser = (await import("marked")).marked;
  } catch (error) {
    throw new Error("Failed to load PDF export library. Please try again.");
  }

  const cleanedContent = cleanMarkdownContent(solutionData.content.trim());

  // Convert markdown to HTML
  const htmlContent = await markedParser.parse(cleanedContent, {
    gfm: true,
    breaks: true,
  });

  // Generate HTML template with "Solution:" prefix
  const html = generateHTMLTemplate(
    `Solution: ${solutionData.paperTitle}`,
    solutionData.pattern,
    solutionData.duration,
    solutionData.totalMarks,
    htmlContent,
    solutionData.createdAt,
  );

  // Open new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error(
      "Popup blocked. Please allow popups for this site to export PDFs.",
    );
  }

  // Write HTML to window
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for fonts to load before printing
  await waitForFonts(printWindow);

  printWindow.focus();
  printWindow.print();

  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      printWindow.close();
    }
  }, 1000);
}
