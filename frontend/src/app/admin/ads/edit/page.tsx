'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdForm } from '@/components/admin/ad';
import { adminAdService } from '@/services/advertisement';
import { Advertisement } from '@/types';
import Loading from '@/components/ui/Loading';
import clsx from 'clsx';

/**
 * 广告编辑内容组件
 */
function AdEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  // 判断是新增还是编辑模式
  const isNew = !idParam || idParam === 'new';

  // 解析ID
  let adId: number | undefined;
  let invalidId = false;

  if (!isNew) {
    const parsedId = parseInt(idParam!, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      invalidId = true;
    } else {
      adId = parsedId;
    }
  }

  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  // 加载广告详情
  useEffect(() => {
    if (adId) {
      loadAd();
    }
  }, [adId]);

  const loadAd = async () => {
    if (!adId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await adminAdService.getAdById(adId);
      setAd(data);
    } catch (err) {
      setError('加载广告失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 无效的ID
  if (invalidId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="h-16 w-16 text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="mt-4 text-secondary-600">无效的广告ID</p>
        <Link
          href="/admin/ads"
          className="mt-4 px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          返回列表
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-secondary-500">
        <p>{error}</p>
        <button
          onClick={loadAd}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 页面头部 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-secondary-200">
        <Link
          href="/admin/ads"
          className={clsx(
            'p-2 rounded-lg text-secondary-500',
            'hover:bg-secondary-100 hover:text-secondary-700',
            'transition-colors'
          )}
          title="返回列表"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>

        <div>
          <h1 className="text-xl font-bold text-secondary-800">
            {isNew ? '新增广告' : '编辑广告'}
          </h1>
          <p className="text-sm text-secondary-500 mt-0.5">
            {isNew ? '填写广告信息创建新广告' : '修改广告信息并保存更改'}
          </p>
        </div>
      </div>

      {/* 表单 */}
      <div className="flex-1 overflow-auto">
        <AdForm ad={ad} isEdit={!isNew} />
      </div>
    </div>
  );
}

/**
 * 广告编辑页面
 * 支持新增和编辑模式
 * - /admin/ads/edit - 新增模式
 * - /admin/ads/edit?id=new - 新增模式
 * - /admin/ads/edit?id=123 - 编辑模式
 */
export default function EditAdPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdEditContent />
    </Suspense>
  );
}
