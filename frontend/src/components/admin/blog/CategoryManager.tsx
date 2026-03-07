'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import {
  adminCategoryService,
  CategoryRequest,
} from '@/services/admin/blog';
import { BlogCategory } from '@/types';

/**
 * 分类管理组件 Props
 */
interface CategoryManagerProps {
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 数据变更回调 */
  onChanged?: () => void;
}

/**
 * 分类管理组件
 * 弹窗形式展示，支持增删改查
 */
export default function CategoryManager({
  onClose,
  onChanged,
}: CategoryManagerProps) {
  const { showSuccess, showError } = useToast();

  // 列表数据
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // 表单状态
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  // 加载分类列表
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminCategoryService.getCategories();
      setCategories(data);
    } catch {
      showError('加载分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 开始编辑
  const handleEdit = (category: BlogCategory) => {
    setEditingId(category.id);
    setFormName(category.name);
    setFormSortOrder(category.sortOrder || 0);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingId(null);
    setFormName('');
    setFormSortOrder(0);
  };

  // 保存分类
  const handleSave = async () => {
    if (!formName.trim()) {
      showError('请输入分类名称');
      return;
    }

    setSaving(true);
    try {
      const data: CategoryRequest = {
        name: formName.trim(),
        sortOrder: formSortOrder,
      };

      if (editingId) {
        await adminCategoryService.updateCategory(editingId, data);
        showSuccess('更新成功');
      } else {
        await adminCategoryService.createCategory(data);
        showSuccess('创建成功');
      }

      handleCancel();
      loadCategories();
      onChanged?.();
    } catch {
      showError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 删除分类
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除分类「${name}」吗？`)) {
      return;
    }

    try {
      await adminCategoryService.deleteCategory(id);
      showSuccess('删除成功');
      loadCategories();
      onChanged?.();
    } catch {
      showError('删除失败，可能该分类下还有博客');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-800">分类管理</h2>
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
                分类名称
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="请输入分类名称"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-secondary-600 mb-1">
                排序
              </label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
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

        {/* 分类列表 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
              <p>暂无分类</p>
            </div>
          ) : (
            <ul className="divide-y divide-secondary-100">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={clsx(
                    'flex items-center justify-between px-6 py-3 hover:bg-secondary-50',
                    editingId === category.id && 'bg-primary-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-secondary-800">
                      {category.name}
                    </span>
                    <span className="text-xs text-secondary-400">
                      排序: {category.sortOrder || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary-500 hover:text-primary-700 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <p className="text-xs text-secondary-500">
            提示：分类删除后不可恢复，请确保分类下没有博客文章。
          </p>
        </div>
      </div>
    </div>
  );
}
