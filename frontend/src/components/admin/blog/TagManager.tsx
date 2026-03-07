'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import { adminTagService, TagRequest } from '@/services/admin/blog';
import { BlogTag } from '@/types';

/**
 * 标签管理组件 Props
 */
interface TagManagerProps {
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 数据变更回调 */
  onChanged?: () => void;
}

/**
 * 标签管理组件
 * 弹窗形式展示，支持增删改查
 */
export default function TagManager({ onClose, onChanged }: TagManagerProps) {
  const { showSuccess, showError } = useToast();

  // 列表数据
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  // 表单状态
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);

  // 加载标签列表
  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await adminTagService.getTags();
      setTags(data || []);
    } catch {
      showError('加载标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  // 开始编辑
  const handleEdit = (tag: BlogTag) => {
    setEditingId(tag.id);
    setFormName(tag.name);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingId(null);
    setFormName('');
  };

  // 保存标签
  const handleSave = async () => {
    if (!formName.trim()) {
      showError('请输入标签名称');
      return;
    }

    setSaving(true);
    try {
      const data: TagRequest = {
        name: formName.trim(),
      };

      if (editingId) {
        await adminTagService.updateTag(editingId, data);
        showSuccess('更新成功');
      } else {
        await adminTagService.createTag(data);
        showSuccess('创建成功');
      }

      handleCancel();
      loadTags();
      onChanged?.();
    } catch {
      showError('保存失败，可能标签名称已存在');
    } finally {
      setSaving(false);
    }
  };

  // 删除标签
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除标签「${name}」吗？`)) {
      return;
    }

    try {
      await adminTagService.deleteTag(id);
      showSuccess('删除成功');
      loadTags();
      onChanged?.();
    } catch {
      showError('删除失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-800">标签管理</h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 新增/编辑表单 */}
        <div className="px-6 py-4 border-b border-secondary-200 bg-secondary-50">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary-600 mb-1">
                标签名称
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="请输入标签名称"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? '保存中...' : editingId ? '更新' : '新增'}
              </button>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-secondary-200 text-secondary-600 text-sm rounded-lg hover:bg-secondary-100"
                >
                  取消
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 标签列表 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
              <p>暂无标签</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={clsx(
                      'group flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors',
                      editingId === tag.id
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-secondary-700 border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    <span className="text-sm">{tag.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-xs hover:text-primary-600"
                        title="编辑"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="text-xs hover:text-red-500"
                        title="删除"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <p className="text-xs text-secondary-500">
            提示：标签删除后不可恢复。
          </p>
        </div>
      </div>
    </div>
  );
}
