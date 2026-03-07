'use client';

import { BlogTag } from '@/types';
import clsx from 'clsx';

/**
 * 标签云组件 Props
 */
interface TagCloudProps {
  tags: BlogTag[];
  selectedId?: number;
  onSelect: (tagId?: number) => void;
  loading?: boolean;
}

/**
 * 标签云骨架屏
 */
function TagSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-7 w-16 bg-secondary-200 rounded-full animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * 标签颜色数组
 */
const TAG_VARIANTS = [
  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', activeBg: 'bg-blue-500', activeText: 'text-white' },
  { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', activeBg: 'bg-green-500', activeText: 'text-white' },
  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', activeBg: 'bg-purple-500', activeText: 'text-white' },
  { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', activeBg: 'bg-orange-500', activeText: 'text-white' },
  { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', activeBg: 'bg-pink-500', activeText: 'text-white' },
  { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', activeBg: 'bg-cyan-500', activeText: 'text-white' },
  { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', activeBg: 'bg-amber-500', activeText: 'text-white' },
  { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', activeBg: 'bg-rose-500', activeText: 'text-white' },
];

/**
 * 获取标签样式
 */
function getTagVariant(index: number) {
  return TAG_VARIANTS[index % TAG_VARIANTS.length];
}

/**
 * 标签云组件
 * 展示标签列表，支持单选
 */
export default function TagCloud({
  tags,
  selectedId,
  onSelect,
  loading = false,
}: TagCloudProps) {
  // 加载状态
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-4">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          标签
        </h3>
        <TagSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        标签
      </h3>

      <div className="flex flex-wrap gap-2">
        {/* 全部标签选项 */}
        <button
          onClick={() => onSelect(undefined)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm transition-all border',
            selectedId === undefined
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-secondary-50 text-secondary-600 border-secondary-200 hover:border-primary-300 hover:text-primary-600'
          )}
        >
          全部
        </button>

        {/* 标签列表 */}
        {tags.map((tag, index) => {
          const variant = getTagVariant(index);
          const isActive = selectedId === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm transition-all border',
                isActive
                  ? `${variant.activeBg} ${variant.activeText} border-transparent`
                  : `${variant.bg} ${variant.text} ${variant.border} hover:shadow-sm`
              )}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {/* 空状态 */}
      {tags.length === 0 && (
        <p className="text-secondary-400 text-sm text-center py-4">
          暂无标签
        </p>
      )}
    </div>
  );
}
