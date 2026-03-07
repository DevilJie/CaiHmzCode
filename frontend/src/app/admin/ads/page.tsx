'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import { adminAdService, AdListParams } from '@/services/advertisement';
import { Advertisement, PageResult, AdPosition } from '@/types';
import Pagination from '@/components/ui/Pagination';

/**
 * 广告管理页面
 */
export default function AdsPage() {
  const { showSuccess, showError } = useToast();

  // 列表数据
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 筛选条件
  const [positionFilter, setPositionFilter] = useState<AdPosition | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [keyword, setKeyword] = useState('');

  // 加载广告列表
  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const params: AdListParams = {
        page: currentPage - 1,
        size: 10,
        position: positionFilter,
        status: statusFilter,
        keyword: keyword || undefined,
      };

      const result: PageResult<Advertisement> = await adminAdService.getAds(params);
      setAds(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      showError('加载广告列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentPage, positionFilter, statusFilter, keyword, showError]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadAds();
  };

  // 重置筛选
  const handleReset = () => {
    setPositionFilter(undefined);
    setStatusFilter(undefined);
    setKeyword('');
    setCurrentPage(1);
  };

  // 启用广告
  const handleEnable = async (id: number) => {
    try {
      await adminAdService.enableAd(id);
      showSuccess('启用成功');
      loadAds();
    } catch {
      showError('启用失败');
    }
  };

  // 禁用广告
  const handleDisable = async (id: number) => {
    try {
      await adminAdService.disableAd(id);
      showSuccess('禁用成功');
      loadAds();
    } catch {
      showError('禁用失败');
    }
  };

  // 删除广告
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除广告「${name}」吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await adminAdService.deleteAd(id);
      showSuccess('删除成功');
      loadAds();
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

  // 获取广告位类型名称
  const getPositionName = (position: string) => {
    return position === 'BANNER' ? '轮播' : '弹窗';
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-800">广告管理</h1>
          <p className="text-sm text-secondary-500 mt-1">
            共 {totalElements} 条广告
          </p>
        </div>
        <Link
          href="/admin/ads/edit/new"
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
          新建广告
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center gap-2">
          <select
            value={positionFilter ?? ''}
            onChange={(e) =>
              setPositionFilter(e.target.value as AdPosition | undefined || undefined)
            }
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部类型</option>
            <option value="BANNER">轮播广告</option>
            <option value="POPUP">弹窗广告</option>
          </select>
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
            <option value="1">启用</option>
            <option value="0">禁用</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索广告名称..."
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          />
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

      {/* 广告列表表格 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : ads.length === 0 ? (
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
              d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
            />
          </svg>
          <p>暂无广告数据</p>
          <Link
            href="/admin/ads/edit/new"
            className="mt-4 text-primary-500 hover:underline text-sm"
          >
            点击新建第一个广告
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    广告
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    类型
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    权重
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-secondary-600">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-secondary-600">
                    展示时间
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
                {ads.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={ad.imageUrl}
                          alt={ad.name}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-secondary-800 line-clamp-1">
                            {ad.name}
                          </p>
                          {ad.linkUrl && (
                            <p className="text-xs text-secondary-400 line-clamp-1">
                              {ad.linkUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded',
                          ad.position === 'BANNER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        )}
                      >
                        {getPositionName(ad.position)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-secondary-600">
                      {ad.weight}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          ad.status === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        )}
                      >
                        {ad.status === 1 ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500">
                      <div className="text-xs">
                        {ad.startTime || ad.endTime ? (
                          <>
                            {ad.startTime && <div>开始: {formatDate(ad.startTime)}</div>}
                            {ad.endTime && <div>结束: {formatDate(ad.endTime)}</div>}
                          </>
                        ) : (
                          <span className="text-secondary-400">永久</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500">
                      {formatDate(ad.updateTime)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/ads/edit/${ad.id}`}
                          className="text-primary-500 hover:text-primary-700 text-sm"
                        >
                          编辑
                        </Link>
                        {ad.status === 1 ? (
                          <button
                            onClick={() => handleDisable(ad.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            禁用
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnable(ad.id)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            启用
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ad.id, ad.name)}
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
