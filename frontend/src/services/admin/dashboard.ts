import apiClient from '@/lib/axios';
import { ApiResponse, DashboardStats } from '@/types';

/**
 * 仪表盘服务
 */
export const dashboardService = {
  /**
   * 获取仪表盘统计数据
   */
  async getStats(): Promise<DashboardStats> {
    const response = (await apiClient.get(
      '/admin/dashboard/stats'
    )) as ApiResponse<DashboardStats>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取统计数据失败');
  },
};

export default dashboardService;
