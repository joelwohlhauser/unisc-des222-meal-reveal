import React from "react";
import ReactMarkdown from "react-markdown";
import supersub from "remark-supersub";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "~/lib/utils";

export default function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <ReactMarkdown
      className={cn("prose prose-slate", className)}
      rehypePlugins={[[rehypeRaw] as never]}
      remarkPlugins={[remarkGfm, supersub]}
    >
      {content}
    </ReactMarkdown>
  );
}
