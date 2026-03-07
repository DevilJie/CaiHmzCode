'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

/**
 * Markdown编辑器 Props
 */
interface MarkdownEditorProps {
  /** 编辑器内容 */
  value: string;
  /** 内容变更回调 */
  onChange: (value: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自动保存回调 */
  onAutoSave?: (value: string) => void;
  /** 自动保存间隔（毫秒），默认3000 */
  autoSaveInterval?: number;
  /** 编辑器高度 */
  height?: string;
}

/**
 * Markdown编辑器组件
 * 左侧编辑，右侧实时预览
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '请输入Markdown内容...',
  disabled = false,
  onAutoSave,
  autoSaveInterval = 3000,
  height = '500px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动保存
  useEffect(() => {
    if (!onAutoSave || !value) return;

    // 清除之前的定时器
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // 设置新的定时器
    autoSaveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onAutoSave(value);
        setLastSaved(new Date());
      } finally {
        setIsSaving(false);
      }
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [value, onAutoSave, autoSaveInterval]);

  // 插入Markdown语法
  const insertSyntax = useCallback((syntax: string, wrap = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = '';

    if (wrap) {
      newText = syntax + selectedText + syntax;
    } else {
      newText = syntax + selectedText;
    }

    const updatedValue = value.substring(0, start) + newText + value.substring(end);
    onChange(updatedValue);

    // 恢复焦点和光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + syntax.length + (wrap ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  // 工具栏按钮
  const toolbarButtons = [
    { icon: 'B', title: '粗体', syntax: '**', wrap: true },
    { icon: 'I', title: '斜体', syntax: '*', wrap: true },
    { icon: 'S', title: '删除线', syntax: '~~', wrap: true },
    { icon: 'H1', title: '标题1', syntax: '# ', wrap: false },
    { icon: 'H2', title: '标题2', syntax: '## ', wrap: false },
    { icon: 'H3', title: '标题3', syntax: '### ', wrap: false },
    { icon: '"', title: '引用', syntax: '> ', wrap: false },
    { icon: '-', title: '列表', syntax: '- ', wrap: false },
    { icon: '1.', title: '有序列表', syntax: '1. ', wrap: false },
    { icon: '[]', title: '任务列表', syntax: '- [ ] ', wrap: false },
    { icon: '`', title: '行内代码', syntax: '`', wrap: true },
    { icon: '</>', title: '代码块', syntax: '```\n', wrap: false, endSyntax: '\n```' },
    { icon: '[L]', title: '链接', syntax: '[', wrap: false, endSyntax: '](url)' },
    { icon: '[I]', title: '图片', syntax: '![alt](', wrap: false, endSyntax: ')' },
    { icon: '---', title: '分割线', syntax: '\n---\n', wrap: false },
  ];

  const handleToolbarClick = (btn: typeof toolbarButtons[0]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    let insertLength = 0;

    if (btn.endSyntax) {
      newText = btn.syntax + selectedText + btn.endSyntax;
      insertLength = btn.syntax.length;
    } else if (btn.wrap) {
      newText = btn.syntax + selectedText + btn.syntax;
      insertLength = btn.syntax.length;
    } else {
      newText = btn.syntax + selectedText;
      insertLength = btn.syntax.length;
    }

    const updatedValue = value.substring(0, start) + newText + value.substring(end);
    onChange(updatedValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + insertLength, start + insertLength + selectedText.length);
      } else {
        textarea.setSelectionRange(start + insertLength, start + insertLength);
      }
    }, 0);
  };

  return (
    <div className="flex flex-col rounded-lg border border-secondary-200 bg-white overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b border-secondary-200 bg-secondary-50 px-2 py-1">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleToolbarClick(btn)}
              disabled={disabled}
              className="px-2 py-1 text-xs font-mono text-secondary-600 hover:bg-secondary-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 自动保存状态 */}
          {onAutoSave && (
            <span className="text-xs text-secondary-400">
              {isSaving ? '保存中...' : lastSaved ? `已保存 ${lastSaved.toLocaleTimeString()}` : ''}
            </span>
          )}

          {/* 视图切换 */}
          <div className="flex rounded border border-secondary-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={clsx(
                'px-2 py-1 text-xs',
                activeTab === 'edit'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-100'
              )}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={clsx(
                'px-2 py-1 text-xs',
                activeTab === 'split'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-100'
              )}
            >
              分屏
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={clsx(
                'px-2 py-1 text-xs',
                activeTab === 'preview'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-100'
              )}
            >
              预览
            </button>
          </div>
        </div>
      </div>

      {/* 编辑/预览区域 */}
      <div className="flex flex-1" style={{ height }}>
        {/* 编辑区 */}
        {(activeTab === 'edit' || activeTab === 'split') && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              'flex-1 p-4 resize-none focus:outline-none font-mono text-sm',
              'border-none focus:ring-0',
              disabled && 'bg-secondary-50 cursor-not-allowed',
              activeTab === 'split' && 'border-r border-secondary-200'
            )}
            style={{ width: activeTab === 'split' ? '50%' : '100%' }}
          />
        )}

        {/* 预览区 */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className={clsx(
              'flex-1 overflow-auto p-4 bg-white',
              activeTab === 'split' && 'border-l border-secondary-200'
            )}
            style={{ width: activeTab === 'split' ? '50%' : '100%' }}
          >
            {value ? (
              <div className="markdown-content prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-4 mt-6 text-secondary-900">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mb-3 mt-5 text-secondary-900">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mb-2 mt-4 text-secondary-900">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 leading-relaxed text-secondary-700">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1 text-secondary-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1 text-secondary-700">{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary-400 pl-4 italic text-secondary-600 my-3">{children}</blockquote>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-secondary-100 text-secondary-800 px-1 py-0.5 rounded text-sm" {...props}>
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
                    pre: ({ children }) => (
                      <pre className="bg-secondary-900 text-secondary-100 p-3 rounded-lg overflow-x-auto mb-3 text-sm">
                        {children}
                      </pre>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => (
                      <img src={src} alt={alt || ''} className="max-w-full h-auto rounded my-2" loading="lazy" />
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-3">
                        <table className="w-full border-collapse text-sm">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-secondary-200 px-3 py-2 bg-secondary-50 font-semibold text-left">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-secondary-200 px-3 py-2">{children}</td>
                    ),
                    hr: () => <hr className="my-4 border-secondary-200" />,
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-secondary-400">
                预览区域（请输入内容）
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between border-t border-secondary-200 bg-secondary-50 px-4 py-1 text-xs text-secondary-500">
        <span>Markdown 编辑器</span>
        <span>字数: {value.length}</span>
      </div>
    </div>
  );
}
