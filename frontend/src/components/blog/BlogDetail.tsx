'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Blog } from '@/types';
import MarkdownRenderer from '@/components/project/MarkdownRenderer';
import { blogService } from '@/services';

// 动态导入视频播放器，避免SSR问题
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

/**
 * 博客详情组件 Props
 */
interface BlogDetailProps {
  blog: Blog;
}

/**
 * 标签颜色数组
 */
const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
];

/**
 * 获取标签颜色
 */
function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

/**
 * 格式化日期
 */
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
 * 展示博客封面、标题、分类、标签、视频、内容等
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
      {/* 封面图 */}
      <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden bg-secondary-100 mb-6">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg
              className="w-24 h-24 text-primary-400"
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

        {/* 分类标签 */}
        {categoryName && (
          <span className="absolute top-4 left-4 px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-full shadow-lg">
            {categoryName}
          </span>
        )}
      </div>

      {/* 标题 */}
      <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
        {title}
      </h1>

      {/* 标签 */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={tag.id}
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(index)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 摘要 */}
      {summary && (
        <p className="text-lg text-secondary-600 mb-6 leading-relaxed border-l-4 border-primary-500 pl-4 italic">
          {summary}
        </p>
      )}

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-secondary-200 text-secondary-500">
        {/* 发布时间 */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={publishTime}>{formatDate(publishTime)}</time>
        </div>

        {/* 浏览次数 */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{viewCount || 0} 次浏览</span>
        </div>
      </div>

      {/* 视频播放器 */}
      {videoUrl && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            视频教程
          </h2>
          <div className="bg-secondary-900 rounded-xl overflow-hidden shadow-lg">
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

      {/* 博客内容 */}
      {content && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            正文内容
          </h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <MarkdownRenderer content={content} />
          </div>
        </section>
      )}
    </article>
  );
}
