'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Blog } from '@/types';
import MarkdownRenderer from '@/components/project/MarkdownRenderer';
import { blogService } from '@/services';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface BlogDetailProps {
  blog: Blog;
}

/**
 * 标签颜色配置 - 支持暗色模式
 */
const TAG_STYLES = [
  'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
];

function getTagStyle(index: number): string {
  return TAG_STYLES[index % TAG_STYLES.length];
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  } catch {
    return dateString;
  }
}

/**
 * 博客详情组件
 * Editorial Magazine 风格 - 沉浸式阅读体验
 */
export default function BlogDetail({ blog }: BlogDetailProps) {
  const {
    id,
    title,
    summary,
    content,
    categoryName,
    tags,
    coverImage,
    videoUrl,
    viewCount,
    publishTime,
  } = blog;

  // 增加浏览次数
  useEffect(() => {
    blogService.incrementViewCount(id);
  }, [id]);

  return (
    <article className="max-w-4xl mx-auto">
      {/* 封面图 - 全宽沉浸式 */}
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 mb-8 shadow-xl">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-slate-500 mx-auto"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* 分类标签 */}
        {categoryName && (
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm text-slate-800 text-sm font-semibold rounded-full shadow-lg">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {categoryName}
            </span>
          </div>
        )}
      </div>

      {/* 标题区 */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-dark-100 mb-6 leading-tight tracking-tight">
          {title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-dark-400 mb-6">
          {/* 发布时间 */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-dark-700 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-sm" dateTime={publishTime}>{formatDate(publishTime)}</time>
          </div>

          {/* 浏览次数 */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-dark-700 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm">{viewCount || 0} 次阅读</span>
          </div>
        </div>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={tag.id}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTagStyle(index)}`}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 摘要 */}
      {summary && (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 via-slate-50 to-cyan-50 dark:from-primary-900/30 dark:via-dark-700 dark:to-cyan-900/30 rounded-2xl border-l-4 border-primary-500">
          <p className="text-lg text-slate-600 dark:text-dark-300 leading-relaxed italic">
            {summary}
          </p>
        </div>
      )}

      {/* 视频播放器 */}
      {videoUrl && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">视频教程</h2>
          </div>
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video">
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 正文内容 */}
      {content && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-dark-700">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-dark-600 dark:to-dark-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-dark-100">正文内容</h2>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-dark-900/30 border border-slate-100 dark:border-dark-700 p-6 sm:p-8 lg:p-10">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 dark:prose-p:text-dark-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline prose-code:bg-slate-100 dark:prose-code:bg-dark-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:text-slate-700 dark:prose-code:text-dark-300 prose-pre:bg-slate-900 dark:prose-pre:bg-dark-900 prose-pre:shadow-lg">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </section>
      )}

      {/* 文章底部装饰 */}
      <div className="text-center py-8 border-t border-slate-100 dark:border-dark-700">
        <p className="text-slate-400 dark:text-dark-500 text-sm">— 感谢阅读 —</p>
      </div>
    </article>
  );
}
