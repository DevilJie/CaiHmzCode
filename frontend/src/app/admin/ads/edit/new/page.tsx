'use client';

import { AdForm } from '@/components/admin/ad';

/**
 * 新建广告页面
 */
export default function NewAdPage() {
  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-secondary-800">新建广告</h1>
        <p className="text-sm text-secondary-500 mt-1">
          创建新的广告内容
        </p>
      </div>

      {/* 表单 */}
      <div className="max-w-2xl bg-white rounded-lg p-6 shadow-sm">
        <AdForm />
      </div>
    </div>
  );
}
