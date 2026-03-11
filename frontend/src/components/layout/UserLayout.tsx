'use client';

import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from '../ui/Toast';

/**
 * UserLayout Props接口
 */
interface UserLayoutProps {
  children: React.ReactNode;
}

/**
 * 用户端布局组件
 * 包含ThemeProvider、Navbar、Footer和ToastProvider
 * 统一用户端页面布局
 */
export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900 text-secondary-900 dark:text-dark-100 transition-colors">
          {/* 顶部导航栏 */}
          <Navbar />

          {/* 主内容区域 - 添加顶部padding以避免被固定导航栏遮挡 */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          {/* 页脚 */}
          <Footer />

          {/* 全局Toast提示 */}
          <Toast />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
