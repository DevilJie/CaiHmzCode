import apiClient from '@/lib/axios';
import {
  ApiResponse,
  SystemConfigResponse,
  SystemConfigRequest,
  SiteInfo,
} from '@/types';

/**
 * 系统配置服务
 */
export const systemConfigService = {
  /**
   * 获取网站信息（用户端）
   */
  async getSiteInfo(): Promise<SiteInfo> {
    const response = (await apiClient.get(
      '/system/info'
    )) as ApiResponse<SiteInfo>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取网站信息失败');
  },

  /**
   * 获取系统配置（管理端）
   */
  async getSystemConfigs(): Promise<SystemConfigResponse> {
    const response = (await apiClient.get(
      '/admin/system/configs'
    )) as ApiResponse<SystemConfigResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取系统配置失败');
  },

  /**
   * 更新系统配置
   */
  async updateSystemConfigs(
    data: SystemConfigRequest
  ): Promise<SystemConfigResponse> {
    const response = (await apiClient.put(
      '/admin/system/configs',
      data
    )) as ApiResponse<SystemConfigResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新系统配置失败');
  },
};

export default systemConfigService;
