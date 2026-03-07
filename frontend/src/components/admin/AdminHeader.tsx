'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

/**
 * 页面标题映射
 */
const PAGE_TITLES: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/projects': '项目管理',
  '/admin/blogs': '博客管理',
  '/admin/feedbacks': '反馈管理',
  '/admin/ads': '广告管理',
  '/admin/donations': '收款码管理',
  '/admin/settings': '系统设置',
  '/admin/users': '用户管理',
};

interface AdminHeaderProps {
  /** 是否折叠 */
  collapsed: boolean;
  /** 折叠按钮点击回调 */
  onToggleCollapse: () => void;
  /** 当前页面路径 */
  currentPath?: string;
}

/**
 * 管理后台顶栏组件
 * 包含折叠按钮、页面标题、用户信息
 */
export default function AdminHeader({
  collapsed,
  onToggleCollapse,
  currentPath = '/admin',
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前页面标题
  const pageTitle = PAGE_TITLES[currentPath] || '管理后台';

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * 处理退出登录
   */
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  /**
   * 获取用户显示名称
   */
  const displayName = user?.nickname || user?.username || '管理员';

  /**
   * 获取用户头像
   */
  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-30 h-16 bg-white shadow-sm',
        'flex items-center justify-between px-4',
        'transition-all duration-300',
        collapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* 左侧：折叠按钮 + 页面标题 */}
      <div className="flex items-center space-x-4">
        {/* 折叠按钮 */}
        <button
          onClick={onToggleCollapse}
          className={clsx(
            'flex items-center justify-center',
            'h-9 w-9 rounded-lg',
            'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700',
            'transition-colors duration-200'
          )}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
              />
            )}
          </svg>
        </button>

        {/* 页面标题 */}
        <h1 className="text-lg font-semibold text-secondary-800">
          {pageTitle}
        </h1>
      </div>

      {/* 右侧：用户信息 */}
      <div className="flex items-center space-x-4">
        {/* 访问前台链接 */}
        <Link
          href="/"
          target="_blank"
          className={clsx(
            'flex items-center space-x-1',
            'text-sm text-secondary-500 hover:text-primary-600',
            'transition-colors duration-200'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75v-6a.75.75 0 00-.75-.75H12m-6.75 0V9m6.75 0V5.25"
            />
          </svg>
          <span>访问前台</span>
        </Link>

        {/* 用户下拉菜单 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={clsx(
              'flex items-center space-x-2',
              'rounded-lg px-2 py-1.5',
              'hover:bg-secondary-100',
              'transition-colors duration-200'
            )}
          >
            {/* 用户头像 */}
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-8 w-8 rounded-full object-cover"
            />
            {/* 用户名 */}
            <span className="text-sm font-medium text-secondary-700">
              {displayName}
            </span>
            {/* 下拉箭头 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={clsx(
                'h-4 w-4 text-secondary-400 transition-transform duration-200',
                dropdownOpen && 'rotate-180'
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* 下拉菜单 */}
          {dropdownOpen && (
            <div
              className={clsx(
                'absolute right-0 mt-2 w-48',
                'bg-white rounded-lg shadow-lg py-1',
                'border border-secondary-100',
                'animate-in fade-in slide-in-from-top-2 duration-200'
              )}
            >
              {/* 用户信息 */}
              <div className="border-b border-secondary-100 px-4 py-2">
                <p className="text-sm font-medium text-secondary-800">
                  {displayName}
                </p>
                <p className="text-xs text-secondary-500">{user?.email}</p>
              </div>

              {/* 个人设置 */}
              <Link
                href="/admin/settings/profile"
                onClick={() => setDropdownOpen(false)}
                className={clsx(
                  'flex items-center px-4 py-2',
                  'text-sm text-secondary-600 hover:bg-secondary-50',
                  'transition-colors duration-200'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                个人设置
              </Link>

              {/* 退出登录 */}
              <button
                onClick={handleLogout}
                className={clsx(
                  'flex w-full items-center px-4 py-2',
                  'text-sm text-red-600 hover:bg-red-50',
                  'transition-colors duration-200'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
