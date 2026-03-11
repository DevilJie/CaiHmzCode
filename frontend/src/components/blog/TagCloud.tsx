'use client';

import { BlogTag } from '@/types';
import clsx from 'clsx';

interface TagCloudProps {
  tags: BlogTag[];
  selectedId?: number;
  onSelect: (tagId?: number) => void;
  loading?: boolean;
}

function TagSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-8 w-16 bg-slate-100 dark:bg-dark-700 rounded-full animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * 标签样式配置 - 柔和的渐变色彩（支持暗色模式）
 */
const TAG_STYLES = [
  { gradient: 'from-violet-500 to-purple-500', inactive: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800' },
  { gradient: 'from-blue-500 to-cyan-500', inactive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  { gradient: 'from-emerald-500 to-teal-500', inactive: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  { gradient: 'from-amber-500 to-orange-500', inactive: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  { gradient: 'from-rose-500 to-pink-500', inactive: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' },
  { gradient: 'from-indigo-500 to-blue-500', inactive: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
  { gradient: 'from-cyan-500 to-sky-500', inactive: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800' },
  { gradient: 'from-fuchsia-500 to-pink-500', inactive: 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800' },
];

function getTagStyle(index: number) {
  return TAG_STYLES[index % TAG_STYLES.length];
}

/**
 * 标签云组件
 * 彩色胶囊标签设计
 */
export default function TagCloud({
  tags,
  selectedId,
  onSelect,
  loading = false,
}: TagCloudProps) {
  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 p-5 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20">
        <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <svg className="w-4 h-4 text-slate-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          热门标签
        </h3>
        <TagSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 p-5 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20">
      <h3 className="text-sm font-bold text-slate-800 dark:text-dark-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-500 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        热门标签
      </h3>

      <div className="flex flex-wrap gap-2">
        {/* 全部标签选项 */}
        <button
          onClick={() => onSelect(undefined)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
            selectedId === undefined
              ? 'bg-slate-800 dark:bg-dark-600 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-dark-300 hover:bg-slate-200 dark:hover:bg-dark-600'
          )}
        >
          全部
        </button>

        {/* 标签列表 */}
        {tags.map((tag, index) => {
          const style = getTagStyle(index);
          const isActive = selectedId === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
                isActive
                  ? `bg-gradient-to-r ${style.gradient} text-white shadow-lg border-transparent`
                  : `${style.inactive} hover:shadow-md hover:-translate-y-0.5`
              )}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {/* 空状态 */}
      {tags.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-dark-700 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400 dark:text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-slate-400 dark:text-dark-500 text-sm">暂无标签</p>
        </div>
      )}
    </div>
  );
}
