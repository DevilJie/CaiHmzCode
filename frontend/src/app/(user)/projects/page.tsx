'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services';
import { ProjectGrid } from '@/components/project';
import Pagination from '@/components/ui/Pagination';
import { TechFilter } from '@/components/project';

/**
 * 项目列表页
 */
export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [techFilter, setTechFilter] = useState<string | undefined>();
  const pageSize = 9;

  // 获取项目列表
  const {
    data: projectData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects', page, pageSize, keyword, techFilter],
    queryFn: () =>
      projectService.getProjects({
        pageNum: page,
        pageSize,
        keyword: keyword || undefined,
        techTag: techFilter,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const projects = projectData?.list || [];
  const totalPages = projectData?.pages || 0;
  const totalElements = projectData?.total || 0;

  // 从项目中提取技术栈列表
  const techStacks = Array.from(
    new Set(projects.flatMap((p) => p.techTags || []))
  ).sort();

  // 当筛选条件变化时重置页码
  useEffect(() => {
    setPage(1);
  }, [keyword, techFilter]);

  // 页码变化处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 搜索处理
  const handleSearch = useCallback(() => {
    setKeyword(searchInput);
  }, [searchInput]);

  // 重置筛选
  const handleReset = () => {
    setSearchInput('');
    setKeyword('');
    setTechFilter(undefined);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              <span className="text-sm font-medium text-white/90">开源项目集合</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              项目展示
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/60 mt-2">
                发现 · 学习 · 实践
              </span>
            </h1>

            {/* 描述 */}
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              {totalElements > 0
                ? `已收录 ${totalElements} 个精选项目，涵盖前端、后端、AI 等多个领域`
                : '探索AI驱动的创新项目，获取完整的源码和技术文档'}
            </p>

            {/* 统计数据 */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalElements}</div>
                <div className="text-sm text-white/50">个项目</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{techStacks.length}</div>
                <div className="text-sm text-white/50">种技术栈</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-slate-50 dark:fill-dark-900">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* 搜索和筛选栏 */}
        <div className="mb-8 p-5 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索项目名称或描述..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-dark-200"
                />
              </div>
            </div>

            {/* 技术栈筛选 */}
            <div className="lg:w-64">
              <select
                value={techFilter ?? ''}
                onChange={(e) => setTechFilter(e.target.value || undefined)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer dark:text-dark-200"
              >
                <option value="">全部技术栈</option>
                {techStacks.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                搜索
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-dark-300 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors"
              >
                重置
              </button>
            </div>
          </div>

          {/* 筛选状态提示 */}
          {(keyword || techFilter) && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-700 flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-dark-400">当前筛选：</span>
              {keyword && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                  关键词: {keyword}
                  <button
                    onClick={() => {
                      setKeyword('');
                      setSearchInput('');
                    }}
                    className="hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {techFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm rounded-full">
                  技术栈: {techFilter}
                  <button
                    onClick={() => setTechFilter(undefined)}
                    className="hover:text-violet-900 dark:hover:text-violet-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 技术栈标签云 */}
        {techStacks.length > 0 && (
          <div className="mb-8">
            <TechFilter
              techs={techStacks}
              selectedTech={techFilter}
              onSelect={setTechFilter}
            />
          </div>
        )}
      </main>

      {/* 项目网格 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ProjectGrid projects={projects} loading={isLoading} />
      </section>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="pb-12 flex justify-center">
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
