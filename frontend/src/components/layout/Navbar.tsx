'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import { systemService } from '@/services/system';
import { SiteInfo, NavConfig } from '@/types';
import ThemeToggle from './ThemeToggle';

/**
 * 导航链接映射配置
 * 根据 navConfig 的 key 生成对应的导航链接
 */
const NAV_LINK_MAP: Record<keyof NavConfig, { href: string; label: string }> = {
  home: { href: '/', label: '首页' },
  projects: { href: '/projects', label: '项目' },
  blogs: { href: '/blogs', label: '博客' },
  feedback: { href: '/feedback', label: '反馈' },
  donation: { href: '/donation', label: '打赏' },
};

/**
 * 默认网站信息
 * 在接口返回前使用此配置
 */
const DEFAULT_SITE_INFO: SiteInfo = {
  siteName: 'AI Factory',
  icpNumber: '',
  footerText: '',
  logoType: 'text',
  logoImageUrl: '',
  navConfig: {
    home: true,
    projects: true,
    blogs: true,
    feedback: true,
    donation: true,
  },
};

/**
 * Navbar导航栏组件
 *
 * 功能:
 * - 固定顶部导航栏
 * - 配置驱动的Logo（支持文字/图片两种模式）
 * - 基于navConfig动态生成导航链接
 * - 集成主题切换功能
 * - 响应式设计（移动端汉堡菜单）
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [isLoading, setIsLoading] = useState(true);

  // 获取网站配置信息
  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const info = await systemService.getSiteInfo();
        setSiteInfo(info);
      } catch (error) {
        console.warn('获取网站信息失败，使用默认配置:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  /**
   * 根据navConfig动态生成导航链接
   * 打赏导航需要额外检查donationEnabled
   */
  const getNavLinks = () => {
    return Object.entries(NAV_LINK_MAP)
      .filter(([key]) => {
        return siteInfo.navConfig[key as keyof NavConfig];
      })
      .map(([key, value]) => ({
        ...value,
        key,
      }));
  };

  const navLinks = getNavLinks();

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

  /**
   * 渲染Logo
   * 支持文字和图片两种模式
   */
  const renderLogo = () => {
    const { logoType, logoImageUrl, siteName } = siteInfo;

    if (logoType === 'image' && logoImageUrl) {
      // 图片模式
      return (
        <div className="flex items-center space-x-2 group">
          <div className="w-8 h-8 relative overflow-hidden rounded-lg group-hover:scale-110 transition-transform">
            <Image
              src={logoImageUrl}
              alt={siteName}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600">
            {siteName}
          </span>
        </div>
      );
    }

    // 文字模式（默认）
    // 提取首字母作为Logo
    const firstChar = siteName.charAt(0).toUpperCase();

    return (
      <div className="flex items-center space-x-2 group">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-sm">{firstChar}</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600">
          {siteName}
        </span>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm shadow-sm dark:shadow-dark-800/50 transition-colors">
      <nav data-testid="main-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            onClick={closeMobileMenu}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary-200 dark:bg-dark-700 rounded-lg animate-pulse" />
                <div className="w-24 h-6 bg-secondary-200 dark:bg-dark-700 rounded animate-pulse" />
              </div>
            ) : (
              renderLogo()
            )}
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
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

            {/* 主题切换按钮 */}
            <ThemeToggle />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center gap-2 md:hidden">
            {/* 主题切换按钮 - 移动端 */}
            <ThemeToggle />

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
                key={link.key}
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
