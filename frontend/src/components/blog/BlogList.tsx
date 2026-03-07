'use client';

import { Blog } from '@/types';
import BlogCard from './BlogCard';

/**
 * 博客列表组件 Props
 */
interface BlogListProps {
  blogs: Blog[];
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * 博客卡片骨架屏
 */
function BlogSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
      {/* 封面图骨架 */}
      <div className="aspect-video bg-secondary-200" />

      {/* 内容骨架 */}
      <div className="p-4">
        <div className="h-6 bg-secondary-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
        <div className="h-4 bg-secondary-200 rounded w-2/3 mb-3" />

        {/* 标签骨架 */}
        <div className="flex gap-1.5 mb-3">
          <div className="h-5 bg-secondary-200 rounded-full w-14" />
          <div className="h-5 bg-secondary-200 rounded-full w-16" />
        </div>

        {/* 底部骨架 */}
        <div className="flex justify-between">
          <div className="h-4 bg-secondary-200 rounded w-16" />
          <div className="h-4 bg-secondary-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-secondary-400">
      <svg
        className="w-20 h-20 mb-4"
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
      <p className="text-lg font-medium mb-1">暂无博客</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * 博客列表组件
 * 响应式布局：移动端1列，平板2列，桌面3列
 */
export default function BlogList({
  blogs,
  loading = false,
  emptyMessage = '还没有发布任何博客',
}: BlogListProps) {
  // 加载状态显示骨架屏
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 空状态
  if (!blogs || blogs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
