import apiClient from '@/lib/axios';
import { ApiResponse, LoginRequest, LoginResponse, User } from '@/types';

/**
 * 认证服务
 * 处理登录、登出、获取用户信息等
 */
export const authService = {
  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = (await apiClient.post(
      '/auth/login',
      credentials
    )) as ApiResponse<LoginResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '登录失败');
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = (await apiClient.get('/auth/me')) as ApiResponse<User>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取用户信息失败');
  },

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // 即使API调用失败，也继续本地登出
      console.warn('退出登录API调用失败');
    }
  },

  /**
   * 刷新Token
   */
  async refreshToken(): Promise<string> {
    const response = (await apiClient.post(
      '/auth/refresh'
    )) as ApiResponse<{ token: string }>;

    if (response.code === 200 && response.data) {
      return response.data.token;
    }

    throw new Error(response.message || '刷新Token失败');
  },

  /**
   * 修改密码
   */
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    const response = (await apiClient.put(
      '/auth/password',
      data
    )) as ApiResponse<null>;

    if (response.code !== 200) {
      throw new Error(response.message || '修改密码失败');
    }
  },
};

export default authService;
