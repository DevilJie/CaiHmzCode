'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown渲染器 Props
 */
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown渲染组件
 * 使用react-markdown渲染GitHub Flavored Markdown
 */
export default function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义链接渲染，新窗口打开
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
              {children}
            </a>
          ),
          // 自定义图片渲染
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-4"
              loading="lazy"
            />
          ),
          // 自定义代码块渲染
          pre: ({ children }) => (
            <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          // 自定义行内代码渲染
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-secondary-100 text-secondary-800 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          // 自定义表头单元格
          th: ({ children }) => (
            <th className="border border-secondary-200 px-4 py-2 bg-secondary-50 font-semibold text-left">
              {children}
            </th>
          ),
          // 自定义表格单元格
          td: ({ children }) => (
            <td className="border border-secondary-200 px-4 py-2">{children}</td>
          ),
          // 自定义引用块
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-secondary-600 my-4">
              {children}
            </blockquote>
          ),
          // 自定义标题
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-8 text-secondary-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mb-3 mt-6 text-secondary-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mb-2 mt-4 text-secondary-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold mb-2 mt-3 text-secondary-900">
              {children}
            </h4>
          ),
          // 自定义列表
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
          ),
          // 自定义段落
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          // 自定义水平线
          hr: () => <hr className="my-6 border-secondary-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
