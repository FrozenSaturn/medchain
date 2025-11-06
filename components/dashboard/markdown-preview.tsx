"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold" {...props} />,
        p: ({ node, ...props }) => <p className="text-sm" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: ({ node, ...props }) => (
          <code className="bg-gray-700 rounded-md px-2 py-1 text-sm font-mono" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
} 