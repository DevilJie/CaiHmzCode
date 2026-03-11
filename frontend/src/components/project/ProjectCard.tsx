'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

/**
 * 项目卡片组件 Props
 */
interface ProjectCardProps {
  project: Project;
}

/**
 * 项目卡片组件
 * 展示项目封面图、名称、简介、技术标签和浏览数
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const { id, name, description, coverImage, techTags, viewCount } = project;

  return (
    <Link
      href={`/projects/detail?id=${id}`}
      data-testid="project-card"
      className="group block bg-white dark:bg-dark-800 rounded-xl shadow-card dark:shadow-dark-900/30 overflow-hidden hover:shadow-lg dark:hover:shadow-dark-900/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* 封面图 */}
      <div className="relative aspect-video overflow-hidden bg-secondary-100 dark:bg-dark-700">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary-100 dark:bg-dark-700">
            <svg
              className="w-16 h-16 text-secondary-300 dark:text-dark-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 项目名称 */}
        <h3 className="font-semibold text-lg text-secondary-900 dark:text-dark-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* 项目简介 */}
        <p className="text-secondary-500 dark:text-dark-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {description || '暂无简介'}
        </p>

        {/* 技术标签 */}
        {techTags && techTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {techTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {techTags.length > 3 && (
              <span className="px-2 py-0.5 bg-secondary-100 dark:bg-dark-700 text-secondary-500 dark:text-dark-400 text-xs rounded-full">
                +{techTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-secondary-400 dark:text-dark-500 text-xs">
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
          <span className="text-primary-500 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
            查看详情
          </span>
        </div>
      </div>
    </Link>
  );
}
