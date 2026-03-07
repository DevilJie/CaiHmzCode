'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { AdForm } from '@/components/admin/ad';
import { adminAdService } from '@/services/advertisement';
import { Advertisement } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 编辑广告页面
 */
export default function EditAdPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id, 10);

  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAd = async () => {
      try {
        setLoading(true);
        const data = await adminAdService.getAdById(id);
        setAd(data);
      } catch (err) {
        setError('加载广告失败');
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-secondary-500">
          {error || '广告不存在'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-secondary-800">编辑广告</h1>
        <p className="text-sm text-secondary-500 mt-1">
          修改广告信息
        </p>
      </div>

      {/* 表单 */}
      <div className="max-w-2xl bg-white rounded-lg p-6 shadow-sm">
        <AdForm ad={ad} isEdit />
      </div>
    </div>
  );
}
