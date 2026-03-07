'use client';

import Link from 'next/link';
import { Blog } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 相关博客组件 Props
 */
interface RelatedBlogsProps {
  blogs: Blog[];
  loading?: boolean;
}

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MM-dd', { locale: zhCN });
  } catch {
    return dateString;
  }
}

/**
 * 相关博客骨架屏
 */
function RelatedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg animate-pulse"
        >
          <div className="w-16 h-12 bg-secondary-200 rounded flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-secondary-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 相关博客推荐组件
 */
export default function RelatedBlogs({ blogs, loading = false }: RelatedBlogsProps) {
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          相关推荐
        </h3>
        <RelatedSkeleton />
      </div>
    );
  }

  // 空状态
  if (!blogs || blogs.length === 0) {
    return null;
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        相关推荐
      </h3>

      <div className="space-y-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors group"
          >
            {/* 缩略图 */}
            <div className="w-16 h-12 bg-secondary-200 rounded overflow-hidden flex-shrink-0 relative">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-secondary-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {blog.title}
              </h4>
              <p className="text-xs text-secondary-400 mt-1">
                {formatDate(blog.publishTime)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
