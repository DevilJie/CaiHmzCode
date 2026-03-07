'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import clsx from 'clsx';

/**
 * 管理后台登录页面
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showError } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已登录，重定向到管理后台
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  /**
   * 处理登录表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 验证输入
      if (!username.trim()) {
        throw new Error('请输入用户名');
      }
      if (!password.trim()) {
        throw new Error('请输入密码');
      }

      // 调用登录接口
      await login({ username: username.trim(), password });

      // 保存记住登录状态
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
        localStorage.setItem('remember_username', username.trim());
      } else {
        localStorage.removeItem('remember_me');
        localStorage.removeItem('remember_username');
      }

      // 登录成功后，由AuthContext负责跳转，这里不需要再调用router.push
    } catch (err) {
      // 处理错误
      let errorMessage = '登录失败，请稍后重试';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || '登录失败，请检查用户名和密码';
      }

      // 设置页面错误信息（持久显示）
      setError(errorMessage);
      // 同时显示Toast通知（5秒后自动消失）
      showError(errorMessage, 5000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 恢复记住的用户名
   */
  useEffect(() => {
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    const savedUsername = localStorage.getItem('remember_username');

    if (rememberMe && savedUsername) {
      setRememberMe(true);
      setUsername(savedUsername);
    }
  }, []);

  // 如果正在检查认证状态或已登录，显示加载中
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="text-sm text-white/80">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">技术分享站</h1>
          <p className="mt-2 text-primary-100">管理后台</p>
        </div>

        {/* 登录表单卡片 */}
        <div className="rounded-xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 flex-shrink-0 text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* 用户名输入框 */}
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-secondary-700"
              >
                用户名
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-secondary-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={clsx(
                    'block w-full rounded-lg border border-secondary-200 py-2.5 pl-10 pr-4',
                    'text-secondary-800 placeholder-secondary-400',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                    'transition-colors duration-200'
                  )}
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            {/* 密码输入框 */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-secondary-700"
              >
                密码
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-secondary-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(
                    'block w-full rounded-lg border border-secondary-200 py-2.5 pl-10 pr-4',
                    'text-secondary-800 placeholder-secondary-400',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                    'transition-colors duration-200'
                  )}
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {/* 记住登录状态 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={clsx(
                    'h-4 w-4 rounded border-secondary-300 text-primary-600',
                    'focus:ring-2 focus:ring-primary-500/20'
                  )}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-secondary-600"
                >
                  记住登录状态
                </label>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'flex w-full items-center justify-center rounded-lg py-3',
                'bg-primary-600 text-white font-medium',
                'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-all duration-200'
              )}
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span>登录中...</span>
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* 返回首页链接 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className={clsx(
                'inline-flex items-center text-sm text-secondary-500',
                'hover:text-primary-600 transition-colors duration-200'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-1 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              返回首页
            </Link>
          </div>
        </div>

        {/* 底部版权信息 */}
        <p className="mt-8 text-center text-sm text-primary-100">
          &copy; {new Date().getFullYear()} 技术分享站 版权所有
        </p>
      </div>
    </div>
  );
}
