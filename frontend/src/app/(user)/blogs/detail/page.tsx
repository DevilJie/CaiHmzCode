'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { blogService } from '@/services';
import { BlogDetail, RelatedBlogs } from '@/components/blog';

/**
 * 博客详情页骨架屏组件
 */
function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 返回按钮骨架 */}
        <div className="mb-6 h-6 w-32 bg-slate-200 dark:bg-dark-700 rounded animate-pulse" />
        {/* 主内容骨架 */}
        <div className="animate-pulse">
          {/* 封面图骨架 */}
          <div className="w-full aspect-[21/9] bg-slate-200 dark:bg-dark-700 rounded-2xl mb-8" />
          {/* 标题骨架 */}
          <div className="h-12 bg-slate-200 dark:bg-dark-700 rounded-xl w-3/4 mb-6" />
          {/* 元信息骨架 */}
          <div className="flex gap-4 mb-6">
            <div className="h-6 bg-slate-200 dark:bg-dark-700 rounded-full w-24" />
            <div className="h-6 bg-slate-200 dark:bg-dark-700 rounded-full w-32" />
            <div className="h-6 bg-slate-200 dark:bg-dark-700 rounded-full w-28" />
          </div>
          {/* 标签骨架 */}
          <div className="flex gap-2 mb-8">
            <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-full w-16" />
            <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-full w-20" />
            <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-full w-14" />
          </div>
          {/* 摘要骨架 */}
          <div className="p-6 bg-slate-100 dark:bg-dark-700 rounded-2xl mb-8">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-dark-600 rounded w-full" />
              <div className="h-5 bg-slate-200 dark:bg-dark-600 rounded w-4/5" />
            </div>
          </div>
          {/* 内容骨架 */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
            <div className="space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 dark:bg-dark-700 rounded" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 缺少ID的错误提示组件
 */
function MissingIdError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-xl border border-slate-100 dark:border-dark-700 p-8 text-center">
          {/* 错误图标 */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-500 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-100 mb-3">缺少博客ID</h2>
          <p className="text-slate-500 dark:text-dark-400 mb-6 leading-relaxed">
            请从博客列表中选择一篇文章进行阅读
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-dark-900/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回博客列表
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 无效ID的错误提示组件
 */
function InvalidIdError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-xl border border-slate-100 dark:border-dark-700 p-8 text-center">
          {/* 错误图标 */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-100 mb-3">无效的博客ID</h2>
          <p className="text-slate-500 dark:text-dark-400 mb-6 leading-relaxed">
            博客ID格式不正确，请检查链接是否正确
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-dark-900/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回博客列表
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 博客详情页内容组件
 * 使用 useSearchParams 获取查询参数
 * 注意：所有 React Hooks 必须在条件判断之前调用
 */
function BlogDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const blogId = id ? parseInt(id, 10) : NaN;

  // 所有 Hooks 必须在条件判断之前调用
  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogService.getBlogById(blogId!),
    enabled: !isNaN(blogId),
    staleTime: 5 * 60 * 1000,
  });

  // 获取相关博客
  const { data: relatedBlogs = [], isLoading: isRelatedLoading } = useQuery({
    queryKey: ['related-blogs', blogId],
    queryFn: () => blogService.getRelatedBlogs(blogId!, 5),
    enabled: !isNaN(blogId) && !!blog,
    staleTime: 5 * 60 * 1000,
  });

  // 参数校验 - 在所有 Hooks 调用之后
  if (!id) {
    return <MissingIdError />;
  }

  // ID格式校验
  if (isNaN(blogId)) {
    return <InvalidIdError />;
  }

  // 加载状态
  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  // 错误状态
  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-xl border border-slate-100 dark:border-dark-700 p-8 text-center">
            {/* 错误图标 */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-100 mb-3">页面加载失败</h2>
            <p className="text-slate-500 dark:text-dark-400 mb-6 leading-relaxed">
              {(error as Error)?.message || '博客不存在或已被删除'}
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-dark-900/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* 返回按钮 */}
      <div className="sticky top-16 z-10 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-slate-100 dark:border-dark-700">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">返回博客列表</span>
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-10">
          {/* 博客详情 */}
          <div className="lg:flex-1 min-w-0">
            <BlogDetail blog={blog} />
          </div>
          {/* 侧边栏：相关推荐（桌面端显示） */}
          {relatedBlogs.length > 0 && (
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-32">
                <RelatedBlogs blogs={relatedBlogs} loading={isRelatedLoading} />
              </div>
            </aside>
          )}
        </div>
        {/* 移动端：相关推荐 */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12 lg:hidden">
            <RelatedBlogs blogs={relatedBlogs} loading={isRelatedLoading} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 博客详情页
 * Editorial Magazine 风格 - 沉浸式阅读体验
 * 使用查询参数 ?id=123 支持静态HTML导出
 */
export default function BlogDetailPage() {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailContent />
    </Suspense>
  );
}
