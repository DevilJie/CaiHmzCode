'use client';

import Link from 'next/link';
import { Blog } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface RelatedBlogsProps {
  blogs: Blog[];
  loading?: boolean;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MM-dd', { locale: zhCN });
  } catch {
    return dateString;
  }
}

function RelatedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse"
        >
          <div className="w-16 h-12 bg-slate-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 相关博客推荐组件
 * 玻璃态卡片设计
 */
export default function RelatedBlogs({ blogs, loading = false }: RelatedBlogsProps) {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-lg shadow-slate-200/50">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          相关推荐
        </h3>
        <RelatedSkeleton />
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-lg shadow-slate-200/50">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        相关推荐
      </h3>

      <div className="space-y-3">
        {blogs.map((blog, index) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* 序号 */}
            <div className="w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-300">
              <span className="text-xs font-bold text-slate-600 group-hover:text-white transition-colors">
                {index + 1}
              </span>
            </div>

            {/* 缩略图 */}
            <div className="w-14 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {blog.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDate(blog.publishTime)}
              </p>
            </div>

            {/* 箭头指示器 */}
            <svg className="w-4 h-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
