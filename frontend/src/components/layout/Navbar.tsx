'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

/**
 * 导航链接配置
 */
const navLinks = [
  { href: '/', label: '首页' },
  { href: '/projects', label: '项目' },
  { href: '/blogs', label: '博客' },
  { href: '/feedback', label: '反馈' },
  { href: '/donation', label: '打赏' },
];

/**
 * Navbar导航栏组件
 *
 * 功能:
 * - 固定顶部导航栏
 * - Logo + 网站名称
 * - 导航链接
 * - 响应式设计（移动端汉堡菜单）
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * 切换移动端菜单
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  /**
   * 关闭移动端菜单
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * 检查链接是否激活
   */
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm shadow-sm dark:shadow-dark-800/50 transition-colors">
      <nav data-testid="main-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              技术分享站
            </span>
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActiveLink(link.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-dark-300 hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-dark-700 dark:hover:text-primary-400'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* 分隔线 */}
            <div className="w-px h-6 bg-secondary-200 dark:bg-dark-600 mx-2" />

            {/* 主题切换按钮 */}
            <ThemeToggle />

            {/* 分隔线 */}
            <div className="w-px h-6 bg-secondary-200 dark:bg-dark-600 mx-2" />

            {/* 管理后台入口 */}
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-600 dark:text-dark-300 hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-dark-700 dark:hover:text-primary-400 transition-all duration-200"
            >
              管理后台
            </Link>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center gap-2 md:hidden">
            {/* 主题切换按钮 - 移动端 */}
            <ThemeToggle />

            {/* 管理后台入口 - 移动端 */}
            <Link
              href="/admin"
              className="p-2 text-secondary-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>

            {/* 汉堡菜单按钮 */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-secondary-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={clsx(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActiveLink(link.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-dark-300 hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-dark-700 dark:hover:text-primary-400'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
