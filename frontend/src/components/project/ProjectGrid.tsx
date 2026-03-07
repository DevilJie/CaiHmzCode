'use client';

import { Project } from '@/types';
import ProjectCard from './ProjectCard';

/**
 * 项目网格组件 Props
 */
interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * 项目网格骨架屏
 */
function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
      {/* 封面图骨架 */}
      <div className="aspect-video bg-secondary-200" />

      {/* 内容骨架 */}
      <div className="p-4">
        <div className="h-6 bg-secondary-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
        <div className="h-4 bg-secondary-200 rounded w-2/3 mb-3" />

        {/* 标签骨架 */}
        <div className="flex gap-1.5 mb-3">
          <div className="h-5 bg-secondary-200 rounded-full w-14" />
          <div className="h-5 bg-secondary-200 rounded-full w-16" />
        </div>

        {/* 底部骨架 */}
        <div className="flex justify-between">
          <div className="h-4 bg-secondary-200 rounded w-16" />
          <div className="h-4 bg-secondary-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-secondary-400">
      <svg
        className="w-20 h-20 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p className="text-lg font-medium mb-1">暂无项目</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * 项目网格组件
 * 响应式布局：移动端2列，平板3列，桌面4列
 */
export default function ProjectGrid({
  projects,
  loading = false,
  emptyMessage = '还没有发布任何项目',
}: ProjectGridProps) {
  // 加载状态显示骨架屏
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 空状态
  if (!projects || projects.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
