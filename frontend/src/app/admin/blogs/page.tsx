'use client';

import { useState } from 'react';
import BlogList from '@/components/admin/blog/BlogList';
import CategoryManager from '@/components/admin/blog/CategoryManager';
import TagManager from '@/components/admin/blog/TagManager';

/**
 * 博客管理页面
 */
export default function BlogsPage() {
  // 弹窗状态
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-secondary-100">
        <div>
          <h1 className="text-xl font-bold text-secondary-800">博客管理</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="inline-flex items-center px-3 py-1.5 border border-secondary-200 text-secondary-600 text-sm rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
            分类管理
          </button>
          <button
            onClick={() => setShowTagManager(true)}
            className="inline-flex items-center px-3 py-1.5 border border-secondary-200 text-secondary-600 text-sm rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
            </svg>
            标签管理
          </button>
        </div>
      </div>

      {/* 博客列表 */}
      <BlogList />

      {/* 分类管理弹窗 */}
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}

      {/* 标签管理弹窗 */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}
    </div>
  );
}
