'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Project, PageResult } from '@/types';
import { adminProjectService } from '@/services/admin';
import { ProjectList } from '@/components/admin/project';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/contexts/ToastContext';

/**
 * 项目管理页面
 * 展示项目列表，支持搜索、新增、编辑、删除、同步README
 */
export default function ProjectsPage() {
  const { showError } = useToast();

  // 列表数据
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // 分页参数
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 加载项目列表
   */
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result: PageResult<Project> = await adminProjectService.getProjects({
        page: page - 1, // 后端从0开始
        size: pageSize,
        keyword: searchKeyword || undefined,
      });

      setProjects(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      showError(error instanceof Error ? error.message : '加载项目列表失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchKeyword, showError]);

  // 初始化加载
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  /**
   * 搜索
   */
  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(1); // 搜索时重置页码
  };

  /**
   * 搜索框回车事件
   */
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 清空搜索
   */
  const handleClearSearch = () => {
    setKeyword('');
    setSearchKeyword('');
    setPage(1);
  };

  /**
   * 分页变更
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 页面头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
        <div>
          <h1 className="text-xl font-bold text-secondary-800">项目管理</h1>
          <p className="text-sm text-secondary-500 mt-0.5">
            共 {totalElements} 个项目
          </p>
        </div>

        <Link
          href="/admin/projects/edit/new"
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary-500 text-white hover:bg-primary-600',
            'transition-colors text-sm font-medium'
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          新增项目
        </Link>
      </div>

      {/* 搜索栏 */}
      <div className="px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="搜索项目名称、描述..."
                className={clsx(
                  'w-full pl-10 pr-4 py-2 rounded-lg',
                  'border border-secondary-200 bg-white',
                  'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
                  'text-secondary-800 placeholder-secondary-400'
                )}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className={clsx(
              'px-4 py-2 rounded-lg',
              'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
              'transition-colors text-sm font-medium'
            )}
          >
            搜索
          </button>

          {searchKeyword && (
            <button
              onClick={handleClearSearch}
              className="text-sm text-secondary-500 hover:text-secondary-700"
            >
              清空搜索
            </button>
          )}
        </div>
      </div>

      {/* 项目列表 */}
      <div className="flex-1 overflow-auto">
        <ProjectList
          projects={projects}
          loading={loading}
          onRefresh={loadProjects}
        />
      </div>

      {/* 分页 */}
      {!loading && projects.length > 0 && (
        <div className="px-6 py-4 border-t border-secondary-200">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
