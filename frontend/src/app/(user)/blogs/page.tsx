'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services';
import { BlogList, CategoryFilter, TagCloud } from '@/components/blog';
import Pagination from '@/components/ui/Pagination';

/**
 * 博客列表页
 * 展示博客列表，支持分类/标签筛选和分页
 */
export default function BlogsPage() {
  const [page, setPage] = useState(0);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [tagId, setTagId] = useState<number | undefined>();
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
        page,
        size: pageSize,
        categoryId,
        tagId,
      }),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  // 获取分类列表
  const { data: categories = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10分钟缓存
  });

  // 获取标签列表
  const { data: tags = [], isLoading: isTagLoading } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => blogService.getTags(),
    staleTime: 10 * 60 * 1000, // 10分钟缓存
  });

  const blogs = blogData?.list || [];
  const totalPages = blogData?.pages || 0;
  const totalElements = blogData?.total || 0;

  // 当筛选条件变化时重置页码
  useEffect(() => {
    setPage(0);
  }, [categoryId, tagId]);

  // 页码变化处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // 后端页码从0开始
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 分类变化处理
  const handleCategoryChange = (newCategoryId?: number) => {
    setCategoryId(newCategoryId);
    setTagId(undefined); // 切换分类时清除标签筛选
  };

  // 标签变化处理
  const handleTagChange = (newTagId?: number) => {
    setTagId(newTagId);
    setCategoryId(undefined); // 切换标签时清除分类筛选
  };

  // 清除所有筛选
  const handleClearFilters = () => {
    setCategoryId(undefined);
    setTagId(undefined);
    setPage(0);
  };

  const isFiltering = categoryId !== undefined || tagId !== undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">技术博客</h1>
        <p className="text-secondary-500">
          {totalElements > 0
            ? `共 ${totalElements} 篇博客`
            : '分享技术知识、开发经验、学习心得'}
        </p>
      </div>

      {/* 筛选提示 */}
      {isFiltering && (
        <div className="mb-4 flex items-center gap-2 text-sm text-secondary-600 bg-primary-50 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>
            当前筛选：
            {categoryId && (
              <span className="font-medium text-primary-700">
                {categories.find((c) => c.id === categoryId)?.name}
              </span>
            )}
            {tagId && (
              <span className="font-medium text-primary-700">
                {tags.find((t) => t.id === tagId)?.name}
              </span>
            )}
          </span>
          <button
            onClick={handleClearFilters}
            className="ml-auto text-primary-600 hover:text-primary-700 font-medium"
          >
            清除筛选
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：分类筛选 */}
        <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
          <CategoryFilter
            categories={categories}
            selectedId={categoryId}
            onSelect={handleCategoryChange}
            loading={isCategoryLoading}
          />
        </aside>

        {/* 中间：博客列表 */}
        <main className="flex-1 order-1 lg:order-2">
          {/* 错误状态 */}
          {isBlogError && (
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
              <p className="text-red-600 font-medium mb-2">加载博客失败</p>
              <p className="text-red-500 text-sm">
                {(blogError as Error)?.message || '请稍后重试'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重新加载
              </button>
            </div>
          )}

          {/* 博客列表 */}
          <BlogList
            blogs={blogs}
            loading={isBlogLoading}
            emptyMessage={
              isFiltering
                ? '没有找到符合条件的博客'
                : '还没有发布任何博客，敬请期待'
            }
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
        </main>

        {/* 右侧：标签云 */}
        <aside className="lg:w-64 flex-shrink-0 order-3">
          <TagCloud
            tags={tags}
            selectedId={tagId}
            onSelect={handleTagChange}
            loading={isTagLoading}
          />
        </aside>
      </div>
    </div>
  );
}
