'use client';

import { useState, useEffect } from 'react';
import { adminUserService } from '@/services/admin/user';
import { UserResponse, UserCreateRequest, UserUpdateRequest, UserRole } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import clsx from 'clsx';

interface UserFormModalProps {
  user: UserResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 用户表单弹窗组件
 */
export default function UserFormModal({ user, onClose, onSuccess }: UserFormModalProps) {
  const { showToast } = useToast();
  const isEdit = !!user;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
    avatar: '',
    role: 'ADMIN' as UserRole,
    status: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '',
        nickname: user.nickname || '',
        email: user.email || '',
        avatar: user.avatar || '',
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEdit) {
      if (!formData.username.trim()) {
        newErrors.username = '用户名不能为空';
      } else if (formData.username.length < 3 || formData.username.length > 50) {
        newErrors.username = '用户名长度必须在3-50个字符之间';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = '用户名只能包含字母、数字和下划线';
      }

      if (!formData.password) {
        newErrors.password = '密码不能为空';
      } else if (formData.password.length < 6) {
        newErrors.password = '密码长度不能少于6个字符';
      }
    } else {
      if (formData.password && formData.password.length < 6) {
        newErrors.password = '密码长度不能少于6个字符';
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        const updateData: UserUpdateRequest = {
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          avatar: formData.avatar || undefined,
          role: formData.role,
          status: formData.status,
          password: formData.password || undefined,
        };
        await adminUserService.updateUser(user.id, updateData);
        showToast('更新用户成功', 'success');
      } else {
        const createData: UserCreateRequest = {
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          avatar: formData.avatar || undefined,
          role: formData.role,
        };
        await adminUserService.createUser(createData);
        showToast('创建用户成功', 'success');
      }

      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary-800">
            {isEdit ? '编辑用户' : '新增用户'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={isEdit}
              className={clsx(
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1',
                errors.username
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
                isEdit && 'cursor-not-allowed bg-secondary-50'
              )}
              placeholder="请输入用户名"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              密码 {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={clsx(
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1',
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
              )}
              placeholder={isEdit ? '不修改请留空' : '请输入密码'}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            {isEdit && (
              <p className="mt-1 text-xs text-secondary-500">留空则不修改密码</p>
            )}
          </div>

          {/* 昵称 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              昵称
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="请输入昵称"
            />
          </div>

          {/* 邮箱 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={clsx(
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-1',
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
              )}
              placeholder="请输入邮箱"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 头像URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              头像URL
            </label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="请输入头像URL"
            />
          </div>

          {/* 角色 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              角色 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="ADMIN">管理员</option>
              <option value="SUPER_ADMIN">超级管理员</option>
            </select>
          </div>

          {/* 状态 */}
          {isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-700">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value={1}>启用</option>
                <option value={0}>禁用</option>
              </select>
            </div>
          )}

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-secondary-300 px-4 py-2 font-medium text-secondary-700 hover:bg-secondary-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className={clsx(
                'rounded-lg px-4 py-2 font-medium text-white',
                saving
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              )}
            >
              {saving ? '保存中...' : isEdit ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
