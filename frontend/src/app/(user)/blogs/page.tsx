'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services';
import { BlogList, CategoryFilter, TagCloud, LayoutToggle } from '@/components/blog';
import type { LayoutMode } from '@/components/blog/LayoutToggle';
import type { CategoryTreeNode } from '@/services/admin/blog';
import Pagination from '@/components/ui/Pagination';

/**
 * 博客列表页
 * Editorial Magazine 风格 - 优雅、现代、有质感
 */
export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [tagId, setTagId] = useState<number | undefined>();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const pageSize = 9;

  // 获取博客列表
  const {
    data: blogData,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
  } = useQuery({
    queryKey: ['blogs', page, pageSize, categoryId, tagId],
    queryFn: () =>
      blogService.getBlogs({
        pageNum: page,
        pageSize,
        categoryId,
        tagId,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // 获取分类树
  const { data: categories = [], isLoading: isCategoryLoading } = useQuery<CategoryTreeNode[]>({
    queryKey: ['blog-categories-tree'],
    queryFn: () => blogService.getCategoryTree(),
    staleTime: 10 * 60 * 1000,
  });

  // 获取标签列表
  const { data: tags = [], isLoading: isTagLoading } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => blogService.getTags(),
    staleTime: 10 * 60 * 1000,
  });

  const blogs = blogData?.list || [];
  const totalPages = blogData?.pages || 0;
  const totalElements = blogData?.total || 0;

  // 当筛选条件变化时重置页码
  useEffect(() => {
    setPage(1);
  }, [categoryId, tagId]);

  // 页码变化处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 分类变化处理
  const handleCategoryChange = (newCategoryId?: number) => {
    setCategoryId(newCategoryId);
    setTagId(undefined);
  };

  // 标签变化处理
  const handleTagChange = (newTagId?: number) => {
    setTagId(newTagId);
    setCategoryId(undefined);
  };

  // 清除所有筛选
  const handleClearFilters = () => {
    setCategoryId(undefined);
    setTagId(undefined);
    setPage(1);
  };

  const isFiltering = categoryId !== undefined || tagId !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-white/90">持续更新中</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              技术博客
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/60 mt-2">
                探索 · 学习 · 成长
              </span>
            </h1>

            {/* 描述 */}
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              {totalElements > 0
                ? `已发布 ${totalElements} 篇技术文章，分享前端、后端、DevOps 等领域的知识与经验`
                : '分享技术知识、开发经验、学习心得，记录成长的每一步'}
            </p>

            {/* 统计数据 */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalElements}</div>
                <div className="text-sm text-white/50">篇文章</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{categories.length}</div>
                <div className="text-sm text-white/50">个分类</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{tags.length}</div>
                <div className="text-sm text-white/50">个标签</div>
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
        {/* 筛选提示条 */}
        {isFiltering && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/30 dark:to-cyan-900/30 border border-primary-100 dark:border-primary-800 rounded-2xl">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <span className="text-sm text-secondary-600 dark:text-dark-300">
                当前筛选：
                <span className="font-semibold text-primary-700 dark:text-primary-400 ml-1">
                  {categoryId && categories.find((c) => c.id === categoryId)?.name}
                  {tagId && tags.find((t) => t.id === tagId)?.name}
                </span>
              </span>
              <button
                onClick={handleClearFilters}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                清除筛选
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* 侧边栏 */}
          <aside className="lg:w-72 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* 分类筛选 */}
              <CategoryFilter
                categories={categories}
                selectedId={categoryId}
                onSelect={handleCategoryChange}
                loading={isCategoryLoading}
              />

              {/* 标签云 */}
              <TagCloud
                tags={tags}
                selectedId={tagId}
                onSelect={handleTagChange}
                loading={isTagLoading}
              />
            </div>
          </aside>

          {/* 博客列表区 */}
          <main className="flex-1 order-1 lg:order-2 min-w-0">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-secondary-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>共 {totalElements} 篇文章</span>
              </div>
              <LayoutToggle value={layoutMode} onChange={setLayoutMode} />
            </div>

            {/* 错误状态 */}
            {isBlogError && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border border-red-100 dark:border-red-800 rounded-2xl p-8 text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">加载失败</h3>
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                  {(blogError as Error)?.message || '请稍后重试'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新加载
                </button>
              </div>
            )}

            {/* 博客列表 */}
            <BlogList
              blogs={blogs}
              loading={isBlogLoading}
              layoutMode={layoutMode}
              emptyMessage={
                isFiltering
                  ? '没有找到符合条件的博客'
                  : '还没有发布任何博客，敬请期待'
              }
            />

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </main>
    </div>
  );
}
