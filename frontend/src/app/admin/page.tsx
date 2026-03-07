'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/admin/dashboard';
import { DashboardStats } from '@/types';
import clsx from 'clsx';

/**
 * 管理后台首页 - 仪表盘
 * 显示系统概览数据和欢迎信息
 */
export default function AdminDashboard() {
  const { user, isSuperAdmin } = useAuth();
  const displayName = user?.nickname || user?.username || '管理员';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* 欢迎信息 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          欢迎回来，{displayName}
        </h1>
        <p className="mt-1 text-secondary-500">
          这是您的管理后台仪表盘，您可以在这里查看网站运营数据和快捷操作。
        </p>
      </div>

      {/* 统计卡片 */}
      {loading ? (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg bg-white p-4 shadow-card">
              <div className="flex items-center">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-secondary-200"></div>
                <div className="ml-4 flex-1">
                  <div className="mb-2 h-4 w-16 animate-pulse rounded bg-secondary-200"></div>
                  <div className="h-6 w-12 animate-pulse rounded bg-secondary-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="项目总数"
            value={stats?.projectStats.total || 0}
            subtitle={`已展示 ${stats?.projectStats.visible || 0}`}
            icon="folder"
            color="primary"
          />
          <StatCard
            title="博客文章"
            value={stats?.blogStats.total || 0}
            subtitle={`已发布 ${stats?.blogStats.published || 0} / 草稿 ${stats?.blogStats.draft || 0}`}
            icon="document"
            color="success"
          />
          <StatCard
            title="用户反馈"
            value={stats?.feedbackStats.total || 0}
            subtitle={stats?.feedbackStats.unread ? `未读 ${stats.feedbackStats.unread}` : '全部已读'}
            icon="chat"
            color={stats?.feedbackStats.unread ? 'warning' : 'info'}
          />
          <StatCard
            title="访问量"
            value={0}
            subtitle="暂无数据"
            icon="eye"
            color="info"
          />
        </div>
      )}

      {/* 快捷操作 */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-secondary-800">
          快捷操作
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <QuickAction
            href="/admin/projects/edit/new"
            icon="plus"
            label="新建项目"
            color="primary"
          />
          <QuickAction
            href="/admin/blogs/edit/new"
            icon="edit"
            label="撰写博客"
            color="success"
          />
          <QuickAction
            href="/admin/feedbacks"
            icon="inbox"
            label="查看反馈"
            color="warning"
          />
          {isSuperAdmin && (
            <QuickAction
              href="/admin/settings"
              icon="settings"
              label="系统设置"
              color="secondary"
            />
          )}
        </div>
      </div>

      {/* 最新反馈 */}
      {stats?.recentFeedbacks && stats.recentFeedbacks.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-secondary-800">
            最新反馈
          </h2>
          <div className="rounded-lg bg-white shadow-card">
            <div className="divide-y divide-secondary-100">
              {stats.recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 hover:bg-secondary-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-secondary-800">
                          {feedback.name || '匿名用户'}
                        </span>
                        {!feedback.isRead && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            未读
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-secondary-600 line-clamp-2">
                        {feedback.content}
                      </p>
                      <p className="mt-1 text-xs text-secondary-400">
                        {feedback.createTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-secondary-100 p-3 text-center">
              <Link
                href="/admin/feedbacks"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                查看全部反馈
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 系统信息 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-secondary-800">
          系统信息
        </h2>
        <div className="rounded-lg bg-secondary-50 p-4">
          <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex justify-between">
              <dt className="text-secondary-500">前端框架</dt>
              <dd className="font-medium text-secondary-800">Next.js 14 (App Router)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-500">UI 框架</dt>
              <dd className="font-medium text-secondary-800">React 18 + Tailwind CSS</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-500">后端框架</dt>
              <dd className="font-medium text-secondary-800">Spring Boot 3.2</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-500">当前版本</dt>
              <dd className="font-medium text-secondary-800">v1.0.0</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

/**
 * 统计卡片组件
 */
interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    info: 'bg-blue-50 text-blue-600',
  };

  const getIcon = () => {
    const icons: Record<string, JSX.Element> = {
      folder: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      document: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      chat: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      eye: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-card">
      <div className="flex items-center">
        <div className={clsx('flex h-12 w-12 items-center justify-center rounded-lg', colorClasses[color])}>
          {getIcon()}
        </div>
        <div className="ml-4">
          <p className="text-sm text-secondary-500">{title}</p>
          <p className="text-2xl font-bold text-secondary-800">{value}</p>
          {subtitle && (
            <p className="text-xs text-secondary-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 快捷操作组件
 */
interface QuickActionProps {
  href: string;
  icon: string;
  label: string;
  color: 'primary' | 'success' | 'warning' | 'secondary';
}

function QuickAction({ href, icon, label, color }: QuickActionProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
    warning: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    secondary: 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200',
  };

  const getIcon = () => {
    const icons: Record<string, JSX.Element> = {
      plus: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      edit: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      inbox: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 13.5c0 1.234-.467 2.347-1.226 3.176m0 0a5.001 5.001 0 01-9.014 0m9.014 0c.413-.473.734-1.025.95-1.626a5.001 5.001 0 00-9.014 0c.216.6.537 1.153.95 1.626m0 0a4.996 4.996 0 01-2.474-1.933A5.003 5.003 0 018.25 11.5c0-2.762 2.238-5 5-5s5 2.238 5 5c0 .373-.05.736-.145 1.085M3 8.25c0-.537.097-1.052.275-1.528A3.001 3.001 0 016 4.5h12a3 3 0 012.829 4H3.275M3 8.25v9A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25v-9" />
        </svg>
      ),
      settings: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <Link
      href={href}
      className={clsx(
        'flex flex-col items-center rounded-lg p-4 transition-colors',
        colorClasses[color]
      )}
    >
      {getIcon()}
      <span className="mt-2 text-sm font-medium">{label}</span>
    </Link>
  );
}
