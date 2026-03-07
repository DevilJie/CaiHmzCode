import apiClient from '@/lib/axios';
import {
  ApiResponse,
  PageParams,
  PageResult,
  Advertisement,
  AdPosition,
} from '@/types';

// ==================== 用户端广告API ====================

/**
 * 广告服务（用户端）
 */
export const advertisementService = {
  /**
   * 获取广告列表
   * @param position 广告位类型（BANNER/POPUP）
   */
  async getAdvertisements(position?: AdPosition): Promise<Advertisement[]> {
    const response = (await apiClient.get('/advertisements', {
      params: { position },
    })) as ApiResponse<Advertisement[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取广告列表失败');
  },
};

// ==================== 管理端广告API ====================

/**
 * 广告列表查询参数
 */
export interface AdListParams extends PageParams {
  position?: AdPosition;
  status?: number;
}

/**
 * 创建/更新广告请求
 */
export interface AdRequest {
  position: AdPosition;
  name: string;
  imageUrl: string;
  linkUrl?: string;
  weight: number;
  startTime?: string;
  endTime?: string;
  status?: number;
}

/**
 * 广告管理服务（管理端）
 */
export const adminAdService = {
  /**
   * 获取广告列表
   */
  async getAds(params?: AdListParams): Promise<PageResult<Advertisement>> {
    const response = (await apiClient.get('/admin/advertisements', {
      params,
    })) as ApiResponse<PageResult<Advertisement>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取广告列表失败');
  },

  /**
   * 获取广告详情
   */
  async getAdById(id: number): Promise<Advertisement> {
    const response = (await apiClient.get(
      `/admin/advertisements/${id}`
    )) as ApiResponse<Advertisement>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取广告详情失败');
  },

  /**
   * 创建广告
   */
  async createAd(data: AdRequest): Promise<Advertisement> {
    const response = (await apiClient.post(
      '/admin/advertisements',
      data
    )) as ApiResponse<Advertisement>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建广告失败');
  },

  /**
   * 更新广告
   */
  async updateAd(id: number, data: AdRequest): Promise<Advertisement> {
    const response = (await apiClient.put(
      `/admin/advertisements/${id}`,
      data
    )) as ApiResponse<Advertisement>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新广告失败');
  },

  /**
   * 删除广告
   */
  async deleteAd(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/advertisements/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除广告失败');
    }
  },

  /**
   * 启用广告
   */
  async enableAd(id: number): Promise<void> {
    const response = (await apiClient.put(
      `/admin/advertisements/${id}/enable`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '启用广告失败');
    }
  },

  /**
   * 禁用广告
   */
  async disableAd(id: number): Promise<void> {
    const response = (await apiClient.put(
      `/admin/advertisements/${id}/disable`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '禁用广告失败');
    }
  },
};

export default advertisementService;
