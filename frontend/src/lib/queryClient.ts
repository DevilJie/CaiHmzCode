import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client 配置
 * 用于服务端预取数据时使用
 */
export const queryClient = new QueryClient({
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
});
