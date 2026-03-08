'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services';
import { ProjectGrid } from '@/components/project';
import Pagination from '@/components/ui/Pagination';

/**
 * 项目列表页
 * 展示所有项目卡片，支持分页
 */
export default function ProjectsPage() {
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // 获取项目列表
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects', page, pageSize],
    queryFn: () => projectService.getProjects({ page, size: pageSize }),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  const projects = data?.list || [];
  const totalPages = data?.pages || 0;
  const totalElements = data?.total || 0;

  // 页码变化处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // 后端页码从0开始
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">项目展示</h1>
        <p className="text-secondary-500">
          {totalElements > 0
            ? `共 ${totalElements} 个项目`
            : '展示AI开发的精品项目，包含项目介绍、技术栈、源码链接'}
        </p>
      </div>

      {/* 错误状态 */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
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
          <p className="text-red-600 font-medium mb-2">加载项目失败</p>
          <p className="text-red-500 text-sm">
            {(error as Error)?.message || '请稍后重试'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {/* 项目网格 */}
      <ProjectGrid
        projects={projects}
        loading={isLoading}
        emptyMessage="还没有发布任何项目，敬请期待"
      />

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
