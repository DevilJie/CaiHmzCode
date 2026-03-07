'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 管理后台布局组件
 * 包含侧边栏、顶栏和主内容区
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 登录页面路径
  const isLoginPage = pathname === '/admin/login';

  // 检查登录状态
  useEffect(() => {
    if (isLoading) return;

    // 如果未登录且不在登录页，跳转到登录页
    if (!isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }

    // 如果已登录且在登录页，跳转到管理后台首页
    if (isAuthenticated && isLoginPage) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // 从本地存储恢复侧边栏折叠状态
  useEffect(() => {
    const stored = localStorage.getItem('admin_sidebar_collapsed');
    if (stored !== null) {
      setSidebarCollapsed(stored === 'true');
    }
  }, []);

  // 保存侧边栏折叠状态到本地存储
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
  };

  // 登录页面不显示布局（优先检查，避免阻塞登录页渲染）
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-secondary-500">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录时显示加载状态（等待重定向）
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-secondary-500">正在跳转到登录页...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-100">
      {/* 移动端遮罩层 */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCollapseChange={handleSidebarCollapseChange}
        />
      </div>

      {/* 顶栏 */}
      <AdminHeader
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        currentPath={pathname}
      />

      {/* 主内容区域 */}
      <main
        className={clsx(
          'min-h-screen pt-16 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">
          {/* 卡片式内容容器 */}
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg bg-white shadow-card">{children}</div>
          </div>
        </div>
      </main>

      {/* 移动端底部导航栏（可选） */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-secondary-200 bg-white lg:hidden">
        <div className="flex items-center justify-around py-2">
          <MobileNavItem href="/admin" icon="home" label="首页" />
          <MobileNavItem href="/admin/projects" icon="folder" label="项目" />
          <MobileNavItem href="/admin/blogs" icon="document" label="博客" />
          <MobileNavItem href="/admin/settings" icon="settings" label="设置" />
        </div>
      </nav>
    </div>
  );
}

/**
 * 移动端底部导航项
 */
interface MobileNavItemProps {
  href: string;
  icon: string;
  label: string;
}

function MobileNavItem({ href, icon, label }: MobileNavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === '/admin' ? pathname === href : pathname.startsWith(href);

  const getIcon = () => {
    const icons: Record<string, JSX.Element> = {
      home: (
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
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      folder: (
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
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>
      ),
      document: (
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
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
      settings: (
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
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <a
      href={href}
      className={clsx(
        'flex flex-col items-center py-1 px-3',
        isActive
          ? 'text-primary-600'
          : 'text-secondary-500 hover:text-secondary-700'
      )}
    >
      {getIcon()}
      <span className="mt-1 text-xs">{label}</span>
    </a>
  );
}
