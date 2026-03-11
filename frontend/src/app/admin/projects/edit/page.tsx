'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ProjectForm } from '@/components/admin/project';
import Loading from '@/components/ui/Loading';
import { useSearchParams } from 'next/navigation';

/**
 * 项目编辑页面内容组件
 */
function ProjectEditPageContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  // 判断是否为新增模式
  const isNewMode = !idParam || idParam === 'new';

  // 解析ID
  let projectId: number | undefined;
  let invalidId = false;

  if (!isNewMode) {
    const parsedId = parseInt(idParam!, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      invalidId = true;
    } else {
      projectId = parsedId;
    }
  }

  // 无效的项目ID（既不是 new 也不是有效数字）
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
        <p className="mt-4 text-secondary-600">无效的项目ID</p>
        <Link
          href="/admin/projects"
          className="mt-4 px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 页面头部 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-secondary-200">
        <Link
          href="/admin/projects"
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
            {isNewMode ? '新增项目' : '编辑项目'}
          </h1>
          <p className="text-sm text-secondary-500 mt-0.5">
            {isNewMode
              ? '填写项目信息创建新项目'
              : '修改项目信息并保存更改'}
          </p>
        </div>
      </div>

      {/* 表单 */}
      <div className="flex-1 overflow-auto">
        <ProjectForm projectId={projectId} />
      </div>
    </div>
  );
}

/**
 * 项目编辑页面
 * 支持新增和编辑模式
 * - /admin/projects/edit - 新增模式
 * - /admin/projects/edit?id=new - 新增模式
 * - /admin/projects/edit?id=123 - 编辑模式
 */
export default function ProjectEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading />
        </div>
      }
    >
      <ProjectEditPageContent />
    </Suspense>
  );
}
