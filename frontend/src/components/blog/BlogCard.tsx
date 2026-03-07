'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Blog } from '@/types';

/**
 * 博客卡片组件 Props
 */
interface BlogCardProps {
  blog: Blog;
}

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  } catch {
    return dateString;
  }
}

/**
 * 博客卡片组件
 * 展示博客封面图、标题、摘要、分类、标签和浏览数
 */
export default function BlogCard({ blog }: BlogCardProps) {
  const { id, title, summary, coverImage, categoryName, tags, viewCount, publishTime } = blog;

  return (
    <Link
      href={`/blogs/${id}`}
      className="group block bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* 封面图 */}
      <div className="relative aspect-video overflow-hidden bg-secondary-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg
              className="w-16 h-16 text-primary-400"
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
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
            {categoryName}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="font-semibold text-lg text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* 摘要 */}
        <p className="text-secondary-500 text-sm mb-3 line-clamp-2 leading-relaxed">
          {summary || '暂无摘要'}
        </p>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 bg-secondary-100 text-secondary-500 text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-secondary-400 text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <time dateTime={publishTime}>{formatDate(publishTime)}</time>
        </div>
      </div>
    </Link>
  );
}
