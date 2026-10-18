import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Render model text as readable content, never executable HTML. */
export function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="space-y-4 break-words text-[15px] leading-7 text-stone-700 sm:text-base [&>*:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          p: ({ children }) => <p className="my-3 leading-7">{children}</p>,
          h1: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-semibold text-stone-900">{children}</h3>,
          h2: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-semibold text-stone-900">{children}</h3>,
          h3: ({ children }) => <h4 className="mt-4 mb-2 font-semibold text-stone-900">{children}</h4>,
          strong: ({ children }) => <strong className="font-semibold text-stone-900">{children}</strong>,
          ul: ({ children }) => <ul className="my-3 list-disc space-y-2 pl-5 marker:text-orange-600">{children}</ul>,
          ol: ({ children, start }) => <ol start={start} className="my-3 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-orange-700">{children}</ol>,
          li: ({ children }) => <li className="pl-1 [&>p]:my-1">{children}</li>,
          blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-orange-200 pl-4 text-stone-600 [&>p]:my-1">{children}</blockquote>,
          hr: () => <hr className="my-5 border-stone-200" />,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-orange-800 underline underline-offset-4">{children}</a>,
          // Remote model-supplied images are not loaded automatically.
          img: ({ alt }) => <span>{alt || 'Image'}</span>,
          table: ({ children }) => <div role="region" aria-label="Comparison table" tabIndex={0} className="my-4 max-w-full overflow-x-auto rounded-xl border border-stone-200"><table className="w-full border-collapse text-left text-sm leading-6">{children}</table></div>,
          thead: ({ children }) => <thead className="bg-orange-50 text-stone-900">{children}</thead>,
          th: ({ children }) => <th className="min-w-28 border-b border-stone-200 px-4 py-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="min-w-28 border-b border-stone-100 px-4 py-3 align-top">{children}</td>,
          pre: ({ children }) => <pre className="my-4 overflow-x-auto rounded-xl bg-stone-900 p-4 text-sm leading-6 text-stone-100">{children}</pre>,
          code: ({ children }) => <code className="font-mono text-[0.9em]">{children}</code>,
        }}
      >{content}</ReactMarkdown>
    </div>
  );
}
