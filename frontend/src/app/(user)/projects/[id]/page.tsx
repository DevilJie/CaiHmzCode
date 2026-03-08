'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { projectService } from '@/services';
import { ProjectDetail } from '@/components/project';

/**
 * 项目详情页 Props
 */
interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 项目详情页
 * 展示项目完整信息，包括README内容
 */
export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // 兼容处理：params 可能是 Promise 或普通对象
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;
  const projectId = parseInt(id, 10);

  // 获取项目详情
  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !isNaN(projectId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  // 加载状态
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 骨架屏 */}
        <div className="animate-pulse">
          {/* 封面图骨架 */}
          <div className="w-full aspect-video bg-secondary-200 rounded-xl mb-6" />

          {/* 标题骨架 */}
          <div className="h-10 bg-secondary-200 rounded w-2/3 mb-4" />

          {/* 标签骨架 */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-secondary-200 rounded-full w-16" />
            <div className="h-6 bg-secondary-200 rounded-full w-20" />
            <div className="h-6 bg-secondary-200 rounded-full w-14" />
          </div>

          {/* 简介骨架 */}
          <div className="space-y-2 mb-6">
            <div className="h-5 bg-secondary-200 rounded w-full" />
            <div className="h-5 bg-secondary-200 rounded w-3/4" />
          </div>

          {/* 按钮骨架 */}
          <div className="flex gap-4 mb-8">
            <div className="h-10 bg-secondary-200 rounded-lg w-28" />
            <div className="h-10 bg-secondary-200 rounded-lg w-24" />
          </div>

          {/* README骨架 */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="h-6 bg-secondary-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-secondary-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (isError || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
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
          <h2 className="text-xl font-semibold text-red-700 mb-2">项目加载失败</h2>
          <p className="text-red-600 mb-4">
            {(error as Error)?.message || '项目不存在或已被删除'}
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* 返回按钮 */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-secondary-500 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回项目列表
        </Link>
      </div>

      {/* 项目详情 */}
      <ProjectDetail project={project} />
    </div>
  );
}
