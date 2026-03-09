'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/providers/ThemeProvider';

/**
 * 全局Provider组件
 * 包含React Query、认证上下文、Toast通知和主题切换
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 窗口聚焦时不自动重新获取
            refetchOnWindowFocus: false,
            // 失败重试次数
            retry: 1,
            // 缓存时间（5分钟）
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
