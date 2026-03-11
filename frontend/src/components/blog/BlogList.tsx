'use client';

import Link from 'next/link';
import { Blog } from '@/types';
import BlogCard from './BlogCard';
import type { LayoutMode } from './LayoutToggle';

interface BlogListProps {
  blogs: Blog[];
  loading?: boolean;
  emptyMessage?: string;
  layoutMode?: LayoutMode;
}

/**
 * 博客卡片骨架屏 - 网格模式
 */
function GridSkeleton() {
  return (
    <article className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-700 animate-pulse">
      {/* 封面图骨架 */}
      <div className="aspect-[16/10] bg-slate-100 dark:bg-dark-700" />

      {/* 内容骨架 */}
      <div className="p-5">
        <div className="h-6 bg-slate-100 dark:bg-dark-700 rounded-lg w-3/4 mb-3" />

        {/* 标签骨架 */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-slate-100 dark:bg-dark-700 rounded-md w-20" />
          <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-2/3" />
        </div>

        {/* 底部骨架 */}
        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-dark-700">
          <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-24" />
          <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-16" />
        </div>
      </div>
    </article>
  );
}

/**
 * 博客卡片骨架屏 - 列表模式
 */
function ListSkeleton() {
  return (
    <article className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-700 animate-pulse">
      <div className="flex flex-col sm:flex-row">
        {/* 封面图骨架 */}
        <div className="sm:w-72 flex-shrink-0">
          <div className="aspect-[16/10] sm:aspect-[4/3] bg-slate-100 dark:bg-dark-700" />
        </div>

        {/* 内容骨架 */}
        <div className="flex-1 p-5">
          <div className="h-6 bg-slate-100 dark:bg-dark-700 rounded-lg w-3/4 mb-3" />

          {/* 描述骨架 */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-full" />
            <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-5/6" />
          </div>

          {/* 标签骨架 */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-slate-100 dark:bg-dark-700 rounded-md w-20" />
            <div className="h-6 bg-slate-100 dark:bg-dark-700 rounded-md w-16" />
          </div>

          {/* 底部骨架 */}
          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-dark-700">
            <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-24" />
            <div className="h-4 bg-slate-100 dark:bg-dark-700 rounded w-16" />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * 空状态组件
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-700 dark:to-dark-600 rounded-3xl flex items-center justify-center">
        <svg
          className="w-12 h-12 text-slate-400 dark:text-dark-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <p className="text-lg font-medium text-slate-500 dark:text-dark-400 mb-2">
        暂无内容
      </p>
      <p className="text-sm text-slate-400 dark:text-dark-500">
        {message}
      </p>
    </div>
  );
}

/**
 * 博客列表组件
 * 支持网格和列表两种布局模式
 */
export default function BlogList({
  blogs,
  loading = false,
  emptyMessage = '还没有发布任何博客',
  layoutMode = 'grid',
}: BlogListProps) {
  // 加载状态显示骨架屏
  if (loading) {
    if (layoutMode === 'list') {
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ListSkeleton key={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <GridSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 空状态
  if (!blogs || blogs.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  // 列表模式
  if (layoutMode === 'list') {
    return (
      <div className="space-y-4">
        {blogs.map((blog, index) => (
          <div
            key={blog.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BlogCard blog={blog} layoutMode="list" />
          </div>
        ))}
      </div>
    );
  }

  // 网格模式（默认）
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <div
          key={blog.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <BlogCard blog={blog} layoutMode="grid" />
        </div>
      ))}
    </div>
  );
}
