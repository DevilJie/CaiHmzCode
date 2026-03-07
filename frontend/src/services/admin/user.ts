import apiClient from '@/lib/axios';
import {
  ApiResponse,
  PageResult,
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/types';

/**
 * 用户列表请求参数
 */
export interface UserListParams {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
  status?: number;
}

/**
 * 用户管理服务
 */
export const adminUserService = {
  /**
   * 获取用户列表
   */
  async getUserList(params?: UserListParams): Promise<PageResult<UserResponse>> {
    const response = (await apiClient.get('/admin/users', {
      params,
    })) as ApiResponse<PageResult<UserResponse>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取用户列表失败');
  },

  /**
   * 获取用户详情
   */
  async getUserById(id: number): Promise<UserResponse> {
    const response = (await apiClient.get(
      `/admin/users/${id}`
    )) as ApiResponse<UserResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取用户详情失败');
  },

  /**
   * 创建用户
   */
  async createUser(data: UserCreateRequest): Promise<UserResponse> {
    const response = (await apiClient.post(
      '/admin/users',
      data
    )) as ApiResponse<UserResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建用户失败');
  },

  /**
   * 更新用户
   */
  async updateUser(id: number, data: UserUpdateRequest): Promise<UserResponse> {
    const response = (await apiClient.put(
      `/admin/users/${id}`,
      data
    )) as ApiResponse<UserResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新用户失败');
  },

  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/users/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除用户失败');
    }
  },

  /**
   * 切换用户状态
   */
  async toggleUserStatus(id: number, status: number): Promise<UserResponse> {
    const response = (await apiClient.put(
      `/admin/users/${id}/status`,
      { status }
    )) as ApiResponse<UserResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '切换用户状态失败');
  },
};

export default adminUserService;
