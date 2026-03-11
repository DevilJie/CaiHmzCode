import apiClient from '@/lib/axios';
import { ApiResponse, SiteInfo, NavConfig } from '@/types';

/**
 * 默认导航配置
 * 默认启用所有导航项
 */
const DEFAULT_NAV_CONFIG: NavConfig = {
  home: true,
  projects: true,
  blogs: true,
  feedback: true,
  donation: true,
};

/**
 * 默认网站信息
 * 当接口调用失败时使用此配置作为fallback
 */
const DEFAULT_SITE_INFO: SiteInfo = {
  siteName: 'AI Factory',
  icpNumber: '',
  footerText: '',
  logoType: 'text',
  logoImageUrl: '',
  navConfig: DEFAULT_NAV_CONFIG,
};

/**
 * 系统配置服务
 * 用于获取用户端系统配置信息
 */
export const systemService = {
  /**
   * 获取网站信息
   * 调用 /system/info 接口获取网站配置
   * 如果接口调用失败，返回默认配置
   */
  async getSiteInfo(): Promise<SiteInfo> {
    try {
      const response = (await apiClient.get(
        '/system/info'
      )) as ApiResponse<SiteInfo>;

      if (response.code === 200 && response.data) {
        // 确保navConfig存在，如果不存在则使用默认值
        return {
          ...DEFAULT_SITE_INFO,
          ...response.data,
          navConfig: {
            ...DEFAULT_NAV_CONFIG,
            ...(response.data.navConfig || {}),
          },
        };
      }

      // 如果响应码不是200，返回默认配置
      console.warn('获取网站信息失败，使用默认配置:', response.message);
      return DEFAULT_SITE_INFO;
    } catch (error) {
      // 接口调用失败时，返回默认配置作为fallback
      console.warn('获取网站信息接口调用失败，使用默认配置:', error);
      return DEFAULT_SITE_INFO;
    }
  },
};

export default systemService;
