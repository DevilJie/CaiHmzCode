'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Project, ProjectDetail } from '@/types';
import { adminProjectService, ProjectRequest } from '@/services/admin';
import { useToast } from '@/contexts/ToastContext';
import TechTagInput from './TechTagInput';
import Loading from '@/components/ui/Loading';

/**
 * 项目表单组件Props
 */
interface ProjectFormProps {
  /** 编辑模式时的项目ID，为空则新增模式 */
  projectId?: number;
}

/**
 * 表单初始值
 */
const initialFormValue: ProjectRequest = {
  name: '',
  description: '',
  projectUrl: '',
  githubUrl: '',
  coverImage: '',
  techTags: [],
  sortOrder: 0,
  isShow: 1,
  readmeUrl: '',
};

/**
 * 项目表单组件
 * 支持新增和编辑模式
 */
export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectRequest>(initialFormValue);
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const isEditMode = !!projectId;

  // 加载项目详情（编辑模式）
  useEffect(() => {
    if (projectId) {
      loadProjectDetail(projectId);
    }
  }, [projectId]);

  /**
   * 加载项目详情
   */
  const loadProjectDetail = async (id: number) => {
    setLoading(true);
    try {
      const detail: ProjectDetail = await adminProjectService.getProjectById(id);
      setForm({
        name: detail.name,
        description: detail.description,
        projectUrl: detail.projectUrl || '',
        githubUrl: detail.githubUrl || '',
        coverImage: detail.coverImage || '',
        techTags: detail.techTags || [],
        sortOrder: detail.sortOrder || 0,
        isShow: detail.isShow,
        readmeUrl: (detail as unknown as { readmeUrl?: string }).readmeUrl || '',
      });
      setReadmeContent(detail.readmeContent || '');
    } catch (error) {
      showError(error instanceof Error ? error.message : '加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新表单字段
   */
  const updateField = <K extends keyof ProjectRequest>(
    field: K,
    value: ProjectRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 上传图片
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('只支持 JPG、PNG、GIF、WEBP 格式的图片');
      return;
    }

    // 检查文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showError('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/admin/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.code === 200 && result.data) {
        updateField('coverImage', result.data.url);
        showSuccess('图片上传成功');
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  /**
   * 同步README
   */
  const handleSyncReadme = async () => {
    if (!form.githubUrl && !form.readmeUrl) {
      showError('请先填写 GitHub 地址或 README URL');
      return;
    }

    setSyncing(true);
    try {
      const content = await adminProjectService.syncReadme(projectId!);
      setReadmeContent(content);
      showSuccess('README 同步成功');
    } catch (error) {
      showError(error instanceof Error ? error.message : '同步README失败');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      showError('请输入项目名称');
      return false;
    }
    if (!form.description.trim()) {
      showError('请输入项目描述');
      return false;
    }
    return true;
  };

  /**
   * 提交表单
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isEditMode) {
        await adminProjectService.updateProject(projectId!, form);
        showSuccess('项目更新成功');
      } else {
        const result = await adminProjectService.createProject(form);
        showSuccess('项目创建成功');
        // 创建成功后跳转到编辑页
        router.push(`/admin/projects/edit?id=${(result as Project).id}`);
        return;
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    router.push('/admin/projects');
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loading size="lg" text="加载项目数据..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary-800">基本信息</h3>

        {/* 项目名称 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            项目名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="请输入项目名称"
            className={clsx(
              'w-full px-3 py-2 rounded-lg border border-secondary-200',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
            )}
          />
        </div>

        {/* 项目描述 */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            项目描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="请输入项目描述"
            rows={3}
            className={clsx(
              'w-full px-3 py-2 rounded-lg border border-secondary-200',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
              'resize-none'
            )}
          />
        </div>

        {/* 项目链接 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              项目地址
            </label>
            <input
              type="url"
              value={form.projectUrl}
              onChange={(e) => updateField('projectUrl', e.target.value)}
              placeholder="https://example.com"
              className={clsx(
                'w-full px-3 py-2 rounded-lg border border-secondary-200',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              GitHub 地址
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => updateField('githubUrl', e.target.value)}
              placeholder="https://github.com/user/repo"
              className={clsx(
                'w-full px-3 py-2 rounded-lg border border-secondary-200',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
              )}
            />
          </div>
        </div>

        {/* README URL */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            README URL
          </label>
          <input
            type="url"
            value={form.readmeUrl}
            onChange={(e) => updateField('readmeUrl', e.target.value)}
            placeholder="README 文件的原始 URL（可选，用于同步）"
            className={clsx(
              'w-full px-3 py-2 rounded-lg border border-secondary-200',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
            )}
          />
        </div>
      </div>

      {/* 封面图 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary-800">封面图</h3>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            上传封面
          </label>
          <div className="flex items-start gap-4">
            {/* 图片预览 */}
            <div
              className={clsx(
                'w-40 h-28 rounded-lg border-2 border-dashed border-secondary-200',
                'flex items-center justify-center overflow-hidden',
                'bg-secondary-50'
              )}
            >
              {form.coverImage ? (
                <img
                  src={form.coverImage}
                  alt="封面预览"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-secondary-400 text-sm">暂无图片</span>
              )}
            </div>

            {/* 上传按钮 */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={clsx(
                  'px-4 py-2 text-sm rounded-lg',
                  'bg-primary-500 text-white hover:bg-primary-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
              >
                {uploading ? '上传中...' : '选择图片'}
              </button>
              {form.coverImage && (
                <button
                  type="button"
                  onClick={() => updateField('coverImage', '')}
                  className="px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  移除图片
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 技术标签 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary-800">技术标签</h3>
        <TechTagInput
          tags={form.techTags}
          onChange={(tags) => updateField('techTags', tags)}
        />
      </div>

      {/* 显示设置 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary-800">显示设置</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              排序值
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                updateField('sortOrder', parseInt(e.target.value) || 0)
              }
              min={0}
              className={clsx(
                'w-full px-3 py-2 rounded-lg border border-secondary-200',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
              )}
            />
            <p className="mt-1 text-xs text-secondary-500">
              数值越大越靠前
            </p>
          </div>

          {/* 是否显示 */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              显示状态
            </label>
            <select
              value={form.isShow}
              onChange={(e) => updateField('isShow', parseInt(e.target.value))}
              className={clsx(
                'w-full px-3 py-2 rounded-lg border border-secondary-200',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none'
              )}
            >
              <option value={1}>显示</option>
              <option value={0}>隐藏</option>
            </select>
          </div>
        </div>
      </div>

      {/* README 预览（仅编辑模式） */}
      {isEditMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-secondary-800">
              README 内容
            </h3>
            <button
              type="button"
              onClick={handleSyncReadme}
              disabled={syncing}
              className={clsx(
                'px-4 py-2 text-sm rounded-lg',
                'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
            >
              {syncing ? '同步中...' : '同步 README'}
            </button>
          </div>

          <div
            className={clsx(
              'p-4 rounded-lg border border-secondary-200 bg-secondary-50',
              'max-h-96 overflow-y-auto',
              'prose prose-sm prose-secondary max-w-none'
            )}
          >
            {readmeContent ? (
              <pre className="whitespace-pre-wrap text-sm text-secondary-700">
                {readmeContent}
              </pre>
            ) : (
              <p className="text-secondary-400 text-center py-8">
                暂无 README 内容，点击上方按钮同步
              </p>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 text-sm rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={saving}
          className={clsx(
            'px-6 py-2 text-sm rounded-lg',
            'bg-primary-500 text-white hover:bg-primary-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          {saving ? '保存中...' : isEditMode ? '保存修改' : '创建项目'}
        </button>
      </div>
    </form>
  );
}
