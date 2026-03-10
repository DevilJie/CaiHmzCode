'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Blog } from '@/types';
import type { LayoutMode } from './LayoutToggle';

interface BlogCardProps {
  blog: Blog;
  layoutMode?: LayoutMode;
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '暂未发布';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '暂未发布';
    return format(date, 'MM月dd日', { locale: zhCN });
  } catch {
    return '暂未发布';
  }
}

/**
 * 博客卡片组件
 * Editorial Magazine 风格 - 优雅卡片设计
 * 支持 grid 和 list 两种布局模式
 */
export default function BlogCard({ blog, layoutMode = 'grid' }: BlogCardProps) {
  const { id, title, summary, coverImage, categoryName, tags, viewCount, publishTime } = blog;

  // 列表视图布局
  if (layoutMode === 'list') {
    return (
      <Link
        href={`/blogs/${id}`}
        className="group block"
      >
        <article className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-700 hover:border-slate-200 dark:hover:border-dark-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-dark-900/30 transition-all duration-500 p-4 sm:p-5">
          {/* 封面图 */}
          <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-700 dark:to-dark-600">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                <svg
                  className="w-10 h-10 text-slate-500"
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
            )}

            {/* 分类标签 */}
            {categoryName && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm text-slate-800 dark:text-dark-100 text-xs font-semibold rounded-full shadow-lg">
                  {categoryName}
                </span>
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 标题 */}
            <h3 className="font-bold text-lg text-slate-800 dark:text-dark-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 leading-snug">
              {title}
            </h3>

            {/* 摘要 */}
            <p className="text-slate-500 dark:text-dark-400 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
              {summary || '暂无摘要'}
            </p>

            {/* 标签 */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-dark-300 text-xs rounded-md border border-slate-100 dark:border-dark-600"
                  >
                    #{tag.name}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="px-2.5 py-1 text-slate-400 dark:text-dark-500 text-xs">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 底部信息 */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-dark-700">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-dark-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2" />
                </svg>
                <time className="text-xs" dateTime={publishTime}>{formatDate(publishTime)}</time>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-dark-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs">{viewCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Hover 指示器 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </article>
      </Link>
    );
  }

  // 卡片视图布局（默认）
  return (
    <Link
      href={`/blogs/${id}`}
      className="group block h-full"
    >
      <article className="relative h-full bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-700 hover:border-slate-200 dark:hover:border-dark-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-dark-900/30 transition-all duration-500">
        {/* 封面图 */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-700 dark:to-dark-600">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-slate-500 mx-auto mb-2"
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
            </div>
          )}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* 分类标签 - 悬浮在图片上 */}
          {categoryName && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm text-slate-800 dark:text-dark-100 text-xs font-semibold rounded-full shadow-lg">
                {categoryName}
              </span>
            </div>
          )}

          {/* 阅读时间提示 */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm text-slate-700 dark:text-dark-200 text-xs font-medium rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              阅读文章
            </span>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-5">
          {/* 标题 */}
          <h3 className="font-bold text-lg text-slate-800 dark:text-dark-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="text-slate-500 dark:text-dark-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {summary || '暂无摘要'}
          </p>

          {/* 标签 */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-1 bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-dark-300 text-xs rounded-md border border-slate-100 dark:border-dark-600"
                >
                  #{tag.name}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2.5 py-1 text-slate-400 dark:text-dark-500 text-xs">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-700">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-dark-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2" />
              </svg>
              <time className="text-xs" dateTime={publishTime}>{formatDate(publishTime)}</time>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-dark-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs">{viewCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Hover 指示器 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </article>
    </Link>
  );
}
