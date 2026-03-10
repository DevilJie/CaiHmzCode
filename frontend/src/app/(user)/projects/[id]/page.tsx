'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { projectService } from '@/services';
import { ProjectDetail } from '@/components/project';

/**
 * 项目详情页
 * Editorial Magazine 风格 - 沉浸式体验
 */
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const projectId = parseInt(id, 10);

  // 获取项目详情
  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !isNaN(projectId),
    staleTime: 5 * 60 * 1000,
  });
  // 加载状态
  if (isLoading) {
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
            {/* 技术栈骨架 */}
            <div className="flex gap-2 mb-8">
              <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-lg w-16" />
              <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-lg w-20" />
              <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-lg w-14" />
              <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-lg w-18" />
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
  // 错误状态
  if (isError || !project) {
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
              {(error as Error)?.message || '项目不存在或已被删除'}
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-dark-900/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回项目列表
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* 返回按钮 - Sticky */}
      <div className="sticky top-16 z-10 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-slate-100 dark:border-dark-700">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">返回项目列表</span>
          </Link>
        </div>
      </div>
      {/* 主内容 */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProjectDetail project={project} />
      </div>
    </div>
  );
}
