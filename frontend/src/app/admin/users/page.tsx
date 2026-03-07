'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { adminUserService, UserListParams } from '@/services/admin/user';
import { UserResponse, UserRole, PageResult } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import clsx from 'clsx';
import UserFormModal from '@/components/admin/user/UserFormModal';

/**
 * 用户管理页面
 * 仅超级管理员可访问
 */
export default function UsersPage() {
  const { isSuperAdmin } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<PageResult<UserResponse> | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;

  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  // 加载用户列表
  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin, pageNum, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params: UserListParams = {
        pageNum,
        pageSize,
        keyword: searchKeyword || undefined,
        role: roleFilter || undefined,
        status: statusFilter ? parseInt(statusFilter) : undefined,
      };
      const data = await adminUserService.getUserList(params);
      setUsers(data);
    } catch (error) {
      showToast('加载用户列表失败', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPageNum(1);
    loadUsers();
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user: UserResponse) => {
    if (!confirm(`确定要删除用户 "${user.nickname || user.username}" 吗？`)) {
      return;
    }

    try {
      await adminUserService.deleteUser(user.id);
      showToast('删除用户成功', 'success');
      loadUsers();
    } catch (error) {
      showToast('删除用户失败', 'error');
      console.error(error);
    }
  };

  const handleToggleStatus = async (user: UserResponse) => {
    const newStatus = user.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '启用' : '禁用';

    if (!confirm(`确定要${action}用户 "${user.nickname || user.username}" 吗？`)) {
      return;
    }

    try {
      await adminUserService.toggleUserStatus(user.id, newStatus);
      showToast(`用户已${action}`, 'success');
      loadUsers();
    } catch (error) {
      showToast(`${action}用户失败`, 'error');
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    loadUsers();
  };

  // 权限检查
  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">用户管理</h1>
          <p className="mt-1 text-secondary-500">管理系统管理员账户</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          新增用户
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索用户名、昵称或邮箱..."
              className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPageNum(1);
            }}
            className="rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部角色</option>
            <option value="SUPER_ADMIN">超级管理员</option>
            <option value="ADMIN">管理员</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNum(1);
            }}
            className="rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部状态</option>
            <option value="1">已启用</option>
            <option value="0">已禁用</option>
          </select>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-secondary-100 px-4 py-2 font-medium text-secondary-700 hover:bg-secondary-200"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="rounded-lg bg-white shadow-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : users && users.list && users.list.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-secondary-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">
                    最后登录
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary-500">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-secondary-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {users.list.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.nickname || user.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-medium">
                              {(user.nickname || user.username).charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-secondary-800">
                            {user.nickname || user.username}
                          </p>
                          <p className="text-sm text-secondary-500">{user.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {user.role === 'SUPER_ADMIN' ? '超级管理员' : '管理员'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                          user.status === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        )}
                      >
                        {user.status === 1 ? '已启用' : '已禁用'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-500">
                      {user.lastLoginTime
                        ? new Date(user.lastLoginTime).toLocaleString('zh-CN')
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-500">
                      {new Date(user.createTime).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="rounded p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600"
                          title="编辑"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={clsx(
                            'rounded p-1',
                            user.status === 1
                              ? 'text-yellow-400 hover:bg-yellow-50 hover:text-yellow-600'
                              : 'text-green-400 hover:bg-green-50 hover:text-green-600'
                          )}
                          title={user.status === 1 ? '禁用' : '启用'}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            {user.status === 1 ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                          title="删除"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            {users.pages > 1 && (
              <div className="flex items-center justify-between border-t border-secondary-200 px-6 py-3">
                <p className="text-sm text-secondary-500">
                  共 {users.total} 条记录，第 {pageNum} / {users.pages} 页
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPageNum(pageNum - 1)}
                    disabled={pageNum === 1}
                    className={clsx(
                      'rounded px-3 py-1 text-sm',
                      pageNum === 1
                        ? 'cursor-not-allowed text-secondary-300'
                        : 'text-secondary-600 hover:bg-secondary-100'
                    )}
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPageNum(pageNum + 1)}
                    disabled={pageNum >= users.pages}
                    className={clsx(
                      'rounded px-3 py-1 text-sm',
                      pageNum >= users.pages
                        ? 'cursor-not-allowed text-secondary-300'
                        : 'text-secondary-600 hover:bg-secondary-100'
                    )}
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-secondary-500">暂无用户数据</p>
          </div>
        )}
      </div>

      {/* 用户表单弹窗 */}
      {showModal && (
        <UserFormModal
          user={editingUser}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
