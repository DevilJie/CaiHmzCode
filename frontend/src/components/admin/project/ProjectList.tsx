'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Project } from '@/types';
import { adminProjectService } from '@/services/admin';
import { useToast } from '@/contexts/ToastContext';
import Loading from '@/components/ui/Loading';

/**
 * 项目列表组件Props
 */
interface ProjectListProps {
  /** 项目列表数据 */
  projects: Project[];
  /** 是否加载中 */
  loading: boolean;
  /** 刷新列表回调 */
  onRefresh: () => void;
}

/**
 * 确认对话框组件
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  loading,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* 对话框 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-medium text-secondary-800 mb-2">{title}</h3>
        <p className="text-secondary-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              'px-4 py-2 text-sm rounded-lg text-white transition-colors',
              'bg-red-500 hover:bg-red-600',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? '处理中...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 项目列表组件
 * 展示项目表格，支持编辑、删除、同步README操作
 */
export default function ProjectList({
  projects,
  loading,
  onRefresh,
}: ProjectListProps) {
  const { showSuccess, showError } = useToast();

  // 删除确认对话框状态
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectName: string;
  }>({
    isOpen: false,
    projectId: null,
    projectName: '',
  });
  const [deleting, setDeleting] = useState(false);

  // 同步README状态
  const [syncingId, setSyncingId] = useState<number | null>(null);

  /**
   * 打开删除确认对话框
   */
  const handleDeleteClick = (project: Project) => {
    setDeleteDialog({
      isOpen: true,
      projectId: project.id,
      projectName: project.name,
    });
  };

  /**
   * 确认删除
   */
  const handleConfirmDelete = async () => {
    if (!deleteDialog.projectId) return;

    setDeleting(true);
    try {
      await adminProjectService.deleteProject(deleteDialog.projectId);
      showSuccess('项目删除成功');
      setDeleteDialog({ isOpen: false, projectId: null, projectName: '' });
      onRefresh();
    } catch (error) {
      showError(error instanceof Error ? error.message : '删除项目失败');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * 关闭删除确认对话框
   */
  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, projectId: null, projectName: '' });
  };

  /**
   * 同步README
   */
  const handleSyncReadme = async (project: Project) => {
    setSyncingId(project.id);
    try {
      await adminProjectService.syncReadme(project.id);
      showSuccess(`${project.name} README 同步成功`);
    } catch (error) {
      showError(error instanceof Error ? error.message : '同步README失败');
    } finally {
      setSyncingId(null);
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loading size="lg" text="加载项目列表..." />
      </div>
    );
  }

  // 空状态
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="h-16 w-16 text-secondary-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>
        <p className="mt-4 text-secondary-500">暂无项目数据</p>
        <Link
          href="/admin/projects/edit"
          className="mt-4 px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          创建第一个项目
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">
                项目信息
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-700">
                技术标签
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-secondary-700">
                浏览量
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-secondary-700">
                状态
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-secondary-700">
                排序
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-secondary-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-secondary-50 transition-colors"
              >
                {/* 项目信息 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* 封面图 */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-400">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 名称和描述 */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-secondary-800 truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-secondary-500 truncate max-w-xs">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 技术标签 */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.techTags && project.techTags.length > 0 ? (
                      project.techTags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs rounded bg-primary-50 text-primary-700"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-secondary-400">无标签</span>
                    )}
                    {project.techTags && project.techTags.length > 3 && (
                      <span className="text-xs text-secondary-500">
                        +{project.techTags.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* 浏览量 */}
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-secondary-600">
                    {project.viewCount || 0}
                  </span>
                </td>

                {/* 状态 */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={clsx(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      project.isShow === 1
                        ? 'bg-green-50 text-green-700'
                        : 'bg-secondary-100 text-secondary-600'
                    )}
                  >
                    {project.isShow === 1 ? '显示' : '隐藏'}
                  </span>
                </td>

                {/* 排序 */}
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-secondary-600">
                    {project.sortOrder || 0}
                  </span>
                </td>

                {/* 操作 */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* 编辑 */}
                    <Link
                      href={`/admin/projects/edit?id=${project.id}`}
                      className={clsx(
                        'p-1.5 rounded-lg text-secondary-500',
                        'hover:bg-secondary-100 hover:text-secondary-700',
                        'transition-colors'
                      )}
                      title="编辑"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>

                    {/* 同步README */}
                    <button
                      onClick={() => handleSyncReadme(project)}
                      disabled={syncingId === project.id}
                      className={clsx(
                        'p-1.5 rounded-lg text-secondary-500',
                        'hover:bg-secondary-100 hover:text-secondary-700',
                        'transition-colors',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      title="同步README"
                    >
                      {syncingId === project.id ? (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      )}
                    </button>

                    {/* 删除 */}
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className={clsx(
                        'p-1.5 rounded-lg text-secondary-500',
                        'hover:bg-red-50 hover:text-red-600',
                        'transition-colors'
                      )}
                      title="删除"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="确认删除"
        message={`确定要删除项目「${deleteDialog.projectName}」吗？此操作不可恢复。`}
        confirmText="确认删除"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleting}
      />
    </>
  );
}
