'use client';

import { useState, KeyboardEvent } from 'react';
import clsx from 'clsx';

/**
 * 技术标签输入组件Props
 */
interface TechTagInputProps {
  /** 已选标签列表 */
  tags: string[];
  /** 标签变更回调 */
  onChange: (tags: string[]) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 技术标签输入组件
 * 支持回车添加标签，点击删除标签
 */
export default function TechTagInput({
  tags,
  onChange,
  placeholder = '输入技术标签后按回车添加',
  disabled = false,
}: TechTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  /**
   * 添加标签
   */
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    // 空值或已存在则不添加
    if (!trimmedTag || tags.includes(trimmedTag)) {
      return;
    }
    onChange([...tags, trimmedTag]);
    setInputValue('');
  };

  /**
   * 删除标签
   */
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 输入框为空时，按退格删除最后一个标签
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="w-full">
      {/* 标签展示区 */}
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={clsx(
                'inline-flex items-center gap-1 px-2.5 py-1',
                'bg-primary-50 text-primary-700 text-sm rounded-md',
                'transition-colors'
              )}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-primary-500 hover:text-primary-700 focus:outline-none"
                  aria-label={`删除标签 ${tag}`}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'w-full px-3 py-2 rounded-lg border border-secondary-200',
          'text-secondary-800 placeholder-secondary-400',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
          'transition-colors',
          disabled && 'bg-secondary-50 cursor-not-allowed'
        )}
      />
      <p className="mt-1 text-xs text-secondary-500">
        输入标签后按 Enter 添加，支持多个标签
      </p>
    </div>
  );
}
