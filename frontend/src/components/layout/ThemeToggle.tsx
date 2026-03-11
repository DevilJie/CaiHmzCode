'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

/**
 * 主题选项配置
 */
const themeOptions = [
  { value: 'light', label: '浅色', icon: SunIcon },
  { value: 'dark', label: '深色', icon: MoonIcon },
  { value: 'system', label: '系统', icon: ComputerIcon },
] as const;

/**
 * 太阳图标组件
 */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

/**
 * 月亮图标组件
 */
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

/**
 * 电脑图标组件（系统主题）
 */
function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * ThemeToggle 主题切换组件
 *
 * 功能:
 * - 支持light/dark/system三种模式切换
 * - 下拉菜单显示所有主题选项
 * - 显示当前主题对应的图标
 * - 样式与现有UI风格一致
 * - 支持键盘操作和无障碍访问
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 确保组件只在客户端渲染后显示，避免hydration不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘事件处理
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  /**
   * 获取当前显示的图标
   */
  const getCurrentIcon = () => {
    if (!mounted) return <SunIcon className="w-5 h-5" />;

    switch (resolvedTheme) {
      case 'dark':
        return <MoonIcon className="w-5 h-5" />;
      case 'light':
      default:
        return <SunIcon className="w-5 h-5" />;
    }
  };

  /**
   * 切换下拉菜单
   */
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * 选择主题
   */
  const handleSelectTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  // 服务端渲染时不显示，避免hydration问题
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-secondary-100 dark:bg-dark-700 animate-pulse" />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={toggleDropdown}
        className={clsx(
          'p-2 rounded-lg transition-all duration-200',
          'text-secondary-600 hover:text-primary-600',
          'hover:bg-primary-50 dark:hover:bg-dark-700',
          'dark:text-dark-300 dark:hover:text-primary-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-dark-800',
          isOpen && 'bg-primary-50 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
        )}
        aria-label="切换主题"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {getCurrentIcon()}
      </button>

      {/* 下拉菜单 */}
      <div
        className={clsx(
          'absolute right-0 mt-2 w-36 py-1',
          'bg-white dark:bg-dark-800',
          'rounded-lg shadow-lg border border-secondary-200 dark:border-dark-600',
          'transition-all duration-200 origin-top-right',
          isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="listbox"
        aria-label="主题选项"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleSelectTheme(option.value)}
              className={clsx(
                'w-full px-4 py-2 flex items-center gap-3',
                'text-sm transition-colors duration-150',
                isSelected
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-secondary-600 dark:text-dark-300 hover:bg-secondary-50 dark:hover:bg-dark-700'
              )}
              role="option"
              aria-selected={isSelected}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{option.label}</span>
              {isSelected && (
                <svg
                  className="w-4 h-4 ml-auto text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
