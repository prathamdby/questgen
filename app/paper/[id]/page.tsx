"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

interface QuestionPaper {
  id: string;
  title: string;
  pattern: string;
  duration: string;
  totalMarks: number;
  createdAt: string;
  status: "completed" | "in_progress";
  files?: UploadedFile[];
  content: string;
}

// Mock data - replace with actual API call
const mockPapers: Record<string, QuestionPaper> = {
  "1": {
    id: "1",
    title: "Mathematics Final Exam",
    pattern: "Section A: 10 MCQs, Section B: 5 Short Answers",
    duration: "3 hours",
    totalMarks: 100,
    createdAt: "2025-10-01",
    status: "completed",
    files: [
      { name: "Calculus_Notes.pdf", type: "pdf", size: 2456789 },
      { name: "Linear_Algebra_Chapter.docx", type: "docx", size: 1234567 },
      { name: "Practice_Problems.md", type: "md", size: 45678 },
    ],
    content: `# Mathematics Final Exam

**Class:** Grade 12  
**Duration:** 3 hours  
**Total Marks:** 100

---

## Section A: Multiple Choice Questions (10 × 2 = 20 marks)

**Instructions:** Choose the correct answer for each question.

1. What is the derivative of \`f(x) = x²\`?
   - a) x
   - b) 2x
   - c) x³
   - d) 2

2. Which of the following is a prime number?
   - a) 15
   - b) 21
   - c) 23
   - d) 27

3. The value of sin(90°) is:
   - a) 0
   - b) 1
   - c) -1
   - d) ∞

---

## Section B: Short Answer Questions (5 × 8 = 40 marks)

**Instructions:** Answer all questions. Show your work.

### Question 1 (8 marks)
Find the integral of \`∫(3x² + 2x - 1)dx\`.

### Question 2 (8 marks)
Solve the system of linear equations:
\`\`\`
2x + 3y = 12
x - y = 1
\`\`\`

### Question 3 (8 marks)
Given the matrix **A** = [[1, 2], [3, 4]], find the determinant and inverse of **A**.

### Question 4 (8 marks)
A ball is thrown vertically upward with an initial velocity of 20 m/s. Calculate:
- The maximum height reached
- The time taken to reach maximum height

### Question 5 (8 marks)
Prove that the sum of angles in a triangle is 180°.

---

## Section C: Long Answer Questions (2 × 20 = 40 marks)

**Instructions:** Choose any TWO questions. Provide detailed solutions.

### Question 1 (20 marks)
Consider the function \`f(x) = x³ - 6x² + 9x + 1\`.

a) Find all critical points of the function.  
b) Determine the nature of each critical point (maximum, minimum, or inflection).  
c) Sketch the graph of the function.

### Question 2 (20 marks)
A rectangular garden is to be fenced with 100 meters of fencing material. One side of the garden borders a wall and does not need fencing.

a) Express the area of the garden as a function of one variable.  
b) Find the dimensions that maximize the area.  
c) What is the maximum area?

### Question 3 (20 marks)
Using mathematical induction, prove that for all positive integers n:
\`\`\`
1 + 2 + 3 + ... + n = n(n+1)/2
\`\`\`

---

**End of Examination**

*Good luck!*`,
  },
  "2": {
    id: "2",
    title: "Physics Midterm",
    pattern: "Section A: 15 MCQs, Section B: 3 Long Answers",
    duration: "2 hours",
    totalMarks: 75,
    createdAt: "2025-09-28",
    status: "completed",
    files: [
      { name: "Mechanics_Textbook.pdf", type: "pdf", size: 5678901 },
      { name: "Thermodynamics_Summary.docx", type: "docx", size: 987654 },
    ],
    content: `# Physics Midterm Examination

**Duration:** 2 hours  
**Total Marks:** 75

---

## Section A: Multiple Choice (15 × 2 = 30 marks)

1. Newton's first law states:
   - a) F = ma
   - b) An object in motion stays in motion
   - c) Every action has an equal reaction
   - d) Energy cannot be created

2. The SI unit of force is:
   - a) Joule
   - b) Newton
   - c) Watt
   - d) Pascal

---

## Section B: Long Answer Questions (3 × 15 = 45 marks)

### Question 1
Derive the equations of motion for uniformly accelerated motion.

### Question 2
Explain the laws of thermodynamics with practical examples.

### Question 3
A car accelerates from rest to 60 km/h in 10 seconds. Calculate the acceleration and distance traveled.`,
  },
  "3": {
    id: "3",
    title: "Chemistry Quiz",
    pattern: "Section A: 20 MCQs",
    duration: "1 hour",
    totalMarks: 50,
    createdAt: "2025-09-25",
    status: "in_progress",
    files: [
      { name: "Periodic_Table_Reference.pdf", type: "pdf", size: 234567 },
    ],
    content: `# Chemistry Quiz

**Duration:** 1 hour  
**Total Marks:** 50

---

## Multiple Choice Questions (20 × 2.5 = 50 marks)

1. What is the atomic number of Carbon?
   - a) 6
   - b) 12
   - c) 14
   - d) 8

2. Which element is a noble gas?
   - a) Oxygen
   - b) Nitrogen
   - c) Helium
   - d) Hydrogen

*[Additional questions to be added]*`,
  },
};

export default function PaperPreview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const paper = mockPapers[params.id];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return (
          <svg
            className="h-4 w-4 text-[#ef4444]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6M9 13h6M9 17h3" />
          </svg>
        );
      case "docx":
      case "doc":
        return (
          <svg
            className="h-4 w-4 text-[#2b579a]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6M10 18l-3-6h2l2 4 2-4h2l-3 6h-2z" />
          </svg>
        );
      case "md":
      case "txt":
        return (
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
        );
      default:
        return (
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
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (!paper) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h1 className="text-[24px] font-[550] text-[#171717] dark:text-white">
            Paper not found
          </h1>
          <Link
            href="/home"
            className="mt-4 inline-block text-[15px] text-[#737373] hover:text-[#171717] dark:hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // TODO: Implement regeneration logic
    console.log("Regenerating paper:", paper.id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRegenerating(false);
  };

  const handleExport = () => {
    // TODO: Implement export logic (PDF/DOCX)
    console.log("Exporting paper:", paper.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete with confirmation
    if (
      confirm(
        "Are you sure you want to delete this paper? This action cannot be undone."
      )
    ) {
      console.log("Deleting paper:", paper.id);
      router.push("/home");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyles = (status: QuestionPaper["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]";
      case "in_progress":
        return "bg-[#fef08a] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
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
          <span>Back to papers</span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-[4px] px-2 py-0.5 text-[12px] font-[500] ${getStatusStyles(
                paper.status
              )}`}
            >
              {paper.status === "completed" ? "Completed" : "In Progress"}
            </span>
            <span className="text-[13px] tabular-nums text-[#a3a3a3]">
              Created {formatDate(paper.createdAt)}
            </span>
          </div>

          <h1 className="mb-6 font-sans text-[40px] font-[550] leading-[1.1] tracking-[-0.03em] text-[#171717] dark:text-white sm:text-[56px]">
            {paper.title}
          </h1>

          {/* Metadata Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
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
                Pattern
              </div>
              <p
                className="truncate text-[14px] text-[#171717] dark:text-white"
                title={paper.pattern}
              >
                {paper.pattern}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Duration
              </div>
              <p className="text-[14px] text-[#171717] dark:text-white">
                {paper.duration}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#e5e5e5] bg-[#fafafa] p-4 dark:border-[#333333] dark:bg-[#0a0a0a]">
              <div className="mb-1 flex items-center gap-2 text-[13px] font-[500] text-[#737373]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Total Marks
              </div>
              <p className="text-[14px] tabular-nums text-[#171717] dark:text-white">
                {paper.totalMarks}
              </p>
            </div>
          </div>

          {/* Source Files Section (Collapsible) */}
          {paper.files && paper.files.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="flex w-full items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white p-4 text-left transition-all duration-150 hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:border-[#333333] dark:bg-black dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
                aria-expanded={notesExpanded}
                aria-controls="files-content"
              >
                <div className="flex items-center gap-2">
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
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[14px] font-[500] text-[#171717] dark:text-white">
                    Source Files ({paper.files.length})
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-[#737373] transition-transform duration-200 ${
                    notesExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {notesExpanded && (
                <div id="files-content" className="mt-2 space-y-2">
                  {paper.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-[6px] border border-[#e5e5e5] bg-white px-4 py-3 transition-all duration-150 hover:border-[#d4d4d4] dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#fafafa] dark:bg-[#171717]">
                          {getFileIcon(file.type)}
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
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={`group flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating
                  ? "cursor-not-allowed bg-[#737373] text-white dark:bg-[#525252] dark:text-[#a3a3a3]"
                  : "bg-[#171717] text-white hover:bg-[#404040] focus:ring-[#171717] active:scale-[0.98] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-busy={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                  <span>Regen...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Regen</span>
                </>
              )}
            </button>

            <button
              onClick={handleExport}
              disabled={isRegenerating}
              className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating
                  ? "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] dark:border-[#333333] dark:bg-[#171717] dark:text-[#666666]"
                  : "border-[#e5e5e5] bg-white text-[#171717] hover:border-[#d4d4d4] hover:bg-[#fafafa] focus:ring-[#171717] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-white dark:hover:border-[#525252] dark:hover:bg-[#0a0a0a] dark:focus:ring-white"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={isRegenerating}
              className={`flex h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[6px] border px-3 text-[13px] font-[500] transition-all duration-150 focus:outline-none focus:ring-2 sm:h-[44px] sm:flex-initial sm:gap-2 sm:px-6 sm:text-[15px] ${
                isRegenerating
                  ? "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] dark:border-[#333333] dark:bg-[#171717] dark:text-[#666666]"
                  : "border-[#e5e5e5] bg-white text-[#ef4444] hover:border-[#fca5a5] hover:bg-[#fef2f2] focus:ring-[#ef4444] active:scale-[0.98] dark:border-[#333333] dark:bg-black dark:text-[#f87171] dark:hover:border-[#7f1d1d] dark:hover:bg-[#450a0a] dark:focus:ring-[#f87171]"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* Markdown Preview */}
        <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] sm:p-12">
          <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[550] prose-headings:tracking-[-0.02em] prose-h1:text-[32px] prose-h1:leading-[1.2] prose-h2:text-[24px] prose-h2:leading-[1.3] prose-h3:text-[18px] prose-h3:leading-[1.4] prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-[#525252] prose-li:text-[15px] prose-li:leading-[1.7] prose-li:text-[#525252] prose-strong:font-[550] prose-strong:text-[#171717] prose-code:rounded-[4px] prose-code:bg-[#fafafa] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-[450] prose-code:text-[14px] prose-code:text-[#171717] prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-[6px] prose-pre:border prose-pre:border-[#e5e5e5] prose-pre:bg-[#fafafa] dark:prose-p:text-[#a3a3a3] dark:prose-li:text-[#a3a3a3] dark:prose-strong:text-white dark:prose-code:bg-[#171717] dark:prose-code:text-white dark:prose-pre:border-[#333333] dark:prose-pre:bg-[#171717]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {paper.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
