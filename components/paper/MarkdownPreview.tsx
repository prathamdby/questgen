"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="rounded-[8px] border border-[#e5e5e5] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-[#333333] dark:bg-[#0a0a0a] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] sm:p-12">
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[550] prose-headings:tracking-[-0.02em] prose-h1:text-[32px] prose-h1:leading-[1.2] prose-h2:text-[24px] prose-h2:leading-[1.3] prose-h3:text-[18px] prose-h3:leading-[1.4] prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-[#525252] prose-li:text-[15px] prose-li:leading-[1.7] prose-li:text-[#525252] prose-strong:font-[550] prose-strong:text-[#171717] prose-code:rounded-[4px] prose-code:bg-[#fafafa] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-[450] prose-code:text-[14px] prose-code:text-[#171717] prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:rounded-[6px] prose-pre:border prose-pre:border-[#e5e5e5] prose-pre:bg-[#fafafa] dark:prose-p:text-[#a3a3a3] dark:prose-li:text-[#a3a3a3] dark:prose-strong:text-white dark:prose-code:bg-[#171717] dark:prose-code:text-white dark:prose-pre:border-[#333333] dark:prose-pre:bg-[#171717]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
