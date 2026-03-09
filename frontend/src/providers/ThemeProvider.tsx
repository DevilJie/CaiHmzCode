'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

/**
 * 主题提供者组件
 *
 * 包装next-themes的ThemeProvider，提供暗色/亮色主题切换功能
 *
 * 配置说明:
 * - attribute="class": 使用class属性控制主题（配合Tailwind的darkMode: 'class'）
 * - defaultTheme="system": 默认跟随系统主题
 * - enableSystem: 启用系统主题检测
 * - disableTransitionOnChange: 禁用主题切换时的过渡动画（避免闪烁）
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
