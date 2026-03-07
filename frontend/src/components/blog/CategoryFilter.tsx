'use client';

import { BlogCategory } from '@/types';
import clsx from 'clsx';

/**
 * 分类筛选组件 Props
 */
interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedId?: number;
  onSelect: (categoryId?: number) => void;
  loading?: boolean;
}

/**
 * 分类筛骨架屏
 */
function CategorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-10 bg-secondary-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * 分类筛选组件
 * 展示分类列表，支持单选
 */
export default function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  loading = false,
}: CategoryFilterProps) {
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          分类
        </h3>
        <CategorySkeleton />
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        分类
      </h3>

      <nav className="space-y-1">
        {/* 全部分类选项 */}
        <button
          onClick={() => onSelect(undefined)}
          className={clsx(
            'w-full px-4 py-2.5 text-left rounded-lg transition-colors flex items-center justify-between',
            selectedId === undefined
              ? 'bg-primary-50 text-primary-700 font-medium'
              : 'text-secondary-600 hover:bg-secondary-50'
          )}
        >
          <span>全部分类</span>
          {selectedId === undefined && (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* 分类列表 */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={clsx(
              'w-full px-4 py-2.5 text-left rounded-lg transition-colors flex items-center justify-between',
              selectedId === category.id
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-secondary-600 hover:bg-secondary-50'
            )}
          >
            <span>{category.name}</span>
            {selectedId === category.id && (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </nav>

      {/* 空状态 */}
      {categories.length === 0 && (
        <p className="text-secondary-400 text-sm text-center py-4">
          暂无分类
        </p>
      )}
    </div>
  );
}
