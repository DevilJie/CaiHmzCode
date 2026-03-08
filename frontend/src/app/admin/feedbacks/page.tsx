'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import { adminFeedbackService, FeedbackListParams } from '@/services/admin/feedback';
import { Feedback, PageResult } from '@/types';
import Pagination from '@/components/ui/Pagination';

/**
 * 反馈管理页面
 */
export default function FeedbacksPage() {
  const { showSuccess, showError } = useToast();

  // 列表数据
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 筛选条件
  const [keyword, setKeyword] = useState('');
  const [readFilter, setReadFilter] = useState<number | undefined>(undefined);

  // 选中的反馈（用于批量操作）
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 加载反馈列表
  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const params: FeedbackListParams = {
        pageNum: currentPage,
        pageSize: 10,
        keyword: keyword || undefined,
        isRead: readFilter,
      };

      const result: PageResult<Feedback> = await adminFeedbackService.getFeedbacks(params);
      setFeedbacks(result.list || []);
      setTotalPages(result.pages || 1);
      setTotalElements(result.total || 0);
      setSelectedIds([]); // 重置选中
    } catch {
      showError('加载反馈列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentPage, keyword, readFilter, showError]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadFeedbacks();
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword('');
    setReadFilter(undefined);
    setCurrentPage(1);
  };

  // 标记已读
  const handleMarkAsRead = async (id: number) => {
    try {
      await adminFeedbackService.markAsRead(id);
      showSuccess('已标记为已读');
      loadFeedbacks();
    } catch {
      showError('操作失败');
    }
  };

  // 批量标记已读
  const handleBatchMarkAsRead = async () => {
    if (selectedIds.length === 0) {
      showError('请先选择反馈');
      return;
    }

    try {
      await adminFeedbackService.batchMarkAsRead(selectedIds);
      showSuccess(`已标记 ${selectedIds.length} 条反馈为已读`);
      loadFeedbacks();
    } catch {
      showError('批量操作失败');
    }
  };

  // 删除反馈
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条反馈吗？此操作不可恢复。')) {
      return;
    }

    try {
      await adminFeedbackService.deleteFeedback(id);
      showSuccess('删除成功');
      loadFeedbacks();
    } catch {
      showError('删除失败');
    }
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedIds.length === feedbacks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(feedbacks.map((f) => f.id));
    }
  };

  // 切换单个选中
  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
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
          <h1 className="text-xl font-bold text-secondary-800">反馈管理</h1>
          <p className="text-sm text-secondary-500 mt-1">
            共 {totalElements} 条反馈
          </p>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchMarkAsRead}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            批量标记已读 ({selectedIds.length})
          </button>
        )}
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索姓名、邮箱、内容..."
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={readFilter ?? ''}
            onChange={(e) =>
              setReadFilter(e.target.value ? Number(e.target.value) : undefined)
            }
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部状态</option>
            <option value="0">未读</option>
            <option value="1">已读</option>
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

      {/* 反馈列表表格 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : feedbacks.length === 0 ? (
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
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <p>暂无反馈数据</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === feedbacks.length}
                      onChange={handleSelectAll}
                      className="rounded border-secondary-300"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    联系信息
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    反馈内容
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    提交时间
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className={clsx(
                      'border-b border-secondary-100 hover:bg-secondary-50',
                      !feedback.isRead && 'bg-blue-50/30'
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(feedback.id)}
                        onChange={() => handleToggleSelect(feedback.id)}
                        className="rounded border-secondary-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium text-secondary-800">
                          {feedback.name || '匿名用户'}
                        </p>
                        {feedback.email && (
                          <p className="text-secondary-500">{feedback.email}</p>
                        )}
                        <div className="flex gap-2 text-xs text-secondary-400 mt-1">
                          {feedback.qq && <span>QQ: {feedback.qq}</span>}
                          {feedback.wechat && <span>微信: {feedback.wechat}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-secondary-700 line-clamp-2">
                        {feedback.content}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          feedback.isRead
                            ? 'bg-secondary-100 text-secondary-600'
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {feedback.isRead ? '已读' : '未读'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500">
                      {formatDate(feedback.createTime)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {!feedback.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(feedback.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            标记已读
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(feedback.id)}
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
