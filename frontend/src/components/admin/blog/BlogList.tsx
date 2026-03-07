'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import { adminBlogService, BlogListParams } from '@/services/admin/blog';
import { Blog, PageResult } from '@/types';
import Pagination from '@/components/ui/Pagination';

/**
 * 博客列表组件
 */
export default function BlogList() {
  const { showSuccess, showError } = useToast();

  // 列表数据
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 筛选条件
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  // 加载博客列表
  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: BlogListParams = {
        page: currentPage - 1,
        size: 10,
        keyword: keyword || undefined,
        status: statusFilter,
      };

      const result: PageResult<Blog> = await adminBlogService.getBlogs(params);
      setBlogs(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      showError('加载博客列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentPage, keyword, statusFilter, showError]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadBlogs();
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword('');
    setStatusFilter(undefined);
    setCurrentPage(1);
  };

  // 发布博客
  const handlePublish = async (id: number) => {
    try {
      await adminBlogService.publishBlog(id);
      showSuccess('发布成功');
      loadBlogs();
    } catch {
      showError('发布失败');
    }
  };

  // 取消发布
  const handleUnpublish = async (id: number) => {
    try {
      await adminBlogService.unpublishBlog(id);
      showSuccess('已取消发布');
      loadBlogs();
    } catch {
      showError('操作失败');
    }
  };

  // 删除博客
  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确定要删除博客「${title}」吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await adminBlogService.deleteBlog(id);
      showSuccess('删除成功');
      loadBlogs();
    } catch {
      showError('删除失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-800">博客管理</h1>
          <p className="text-sm text-secondary-500 mt-1">
            共 {totalElements} 篇博客
          </p>
        </div>
        <Link
          href="/admin/blogs/edit/new"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          新建博客
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索博客标题..."
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter ?? ''}
            onChange={(e) =>
              setStatusFilter(e.target.value ? Number(e.target.value) : undefined)
            }
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部状态</option>
            <option value="0">草稿</option>
            <option value="1">已发布</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
          >
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-secondary-200 text-secondary-600 text-sm rounded-lg hover:bg-secondary-100"
          >
            重置
          </button>
        </div>
      </div>

      {/* 博客列表表格 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p>暂无博客数据</p>
          <Link
            href="/admin/blogs/edit/new"
            className="mt-4 text-primary-500 hover:underline text-sm"
          >
            点击新建第一篇博客
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    标题
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    分类
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    标签
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    状态
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    浏览
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    更新时间
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {blog.coverImage && (
                          <img
                            src={blog.coverImage}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-secondary-800 line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-xs text-secondary-400 line-clamp-1">
                            {blog.summary || '暂无摘要'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-600">
                      {blog.categoryName || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-600 rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags?.length > 2 && (
                          <span className="text-xs text-secondary-400">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          blog.status === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        )}
                      >
                        {blog.status === 1 ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-secondary-600">
                      {blog.viewCount || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500">
                      {formatDate(blog.updateTime)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="text-primary-500 hover:text-primary-700 text-sm"
                        >
                          编辑
                        </Link>
                        {blog.status === 1 ? (
                          <button
                            onClick={() => handleUnpublish(blog.id)}
                            className="text-yellow-600 hover:text-yellow-700 text-sm"
                          >
                            取消发布
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(blog.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            发布
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
