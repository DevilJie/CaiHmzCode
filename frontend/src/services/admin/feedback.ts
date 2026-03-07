import apiClient from '@/lib/axios';
import { ApiResponse, PageParams, PageResult, Feedback, DonationQrCode, QrCodeType } from '@/types';

// ==================== 反馈管理API ====================

/**
 * 反馈列表查询参数
 */
export interface FeedbackListParams extends PageParams {
  isRead?: number; // 0-未读 1-已读
}

/**
 * 反馈管理服务
 */
export const adminFeedbackService = {
  /**
   * 获取反馈列表
   */
  async getFeedbacks(params?: FeedbackListParams): Promise<PageResult<Feedback>> {
    const response = (await apiClient.get('/admin/feedbacks', {
      params,
    })) as ApiResponse<PageResult<Feedback>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取反馈列表失败');
  },

  /**
   * 获取反馈详情
   */
  async getFeedbackById(id: number): Promise<Feedback> {
    const response = (await apiClient.get(
      `/admin/feedbacks/${id}`
    )) as ApiResponse<Feedback>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取反馈详情失败');
  },

  /**
   * 标记已读
   */
  async markAsRead(id: number): Promise<void> {
    const response = (await apiClient.put(
      `/admin/feedbacks/${id}/read`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '标记已读失败');
    }
  },

  /**
   * 批量标记已读
   */
  async batchMarkAsRead(ids: number[]): Promise<void> {
    const response = (await apiClient.put('/admin/feedbacks/batch-read', {
      ids,
    })) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '批量标记失败');
    }
  },

  /**
   * 删除反馈
   */
  async deleteFeedback(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/feedbacks/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除反馈失败');
    }
  },

  /**
   * 获取未读数量
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = (await apiClient.get(
        '/admin/feedbacks/unread-count'
      )) as ApiResponse<{ count: number }>;

      if (response.code === 200 && response.data) {
        return response.data.count;
      }

      return 0;
    } catch {
      // 获取未读数量失败返回0，不影响用户体验
      console.warn('获取未读数量失败');
      return 0;
    }
  },
};

// ==================== 收款码管理API ====================

/**
 * 创建/更新收款码请求
 */
export interface DonationQrcodeRequest {
  type: QrCodeType;
  name?: string;
  qrcodeUrl: string;
  isShow?: number;
  sortOrder?: number;
}

/**
 * 收款码管理服务
 */
export const adminDonationService = {
  /**
   * 获取所有收款码
   */
  async getQrcodes(): Promise<DonationQrCode[]> {
    const response = (await apiClient.get(
      '/admin/donation-qrcodes'
    )) as ApiResponse<DonationQrCode[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取收款码列表失败');
  },

  /**
   * 获取收款码详情
   */
  async getQrcodeById(id: number): Promise<DonationQrCode> {
    const response = (await apiClient.get(
      `/admin/donation-qrcodes/${id}`
    )) as ApiResponse<DonationQrCode>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取收款码详情失败');
  },

  /**
   * 创建收款码
   */
  async createQrcode(data: DonationQrcodeRequest): Promise<DonationQrCode> {
    const response = (await apiClient.post(
      '/admin/donation-qrcodes',
      data
    )) as ApiResponse<DonationQrCode>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建收款码失败');
  },

  /**
   * 更新收款码
   */
  async updateQrcode(id: number, data: DonationQrcodeRequest): Promise<DonationQrCode> {
    const response = (await apiClient.put(
      `/admin/donation-qrcodes/${id}`,
      data
    )) as ApiResponse<DonationQrCode>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新收款码失败');
  },

  /**
   * 删除收款码
   */
  async deleteQrcode(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/donation-qrcodes/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除收款码失败');
    }
  },

  /**
   * 切换展示状态
   */
  async toggleShow(id: number): Promise<DonationQrCode> {
    const response = (await apiClient.put(
      `/admin/donation-qrcodes/${id}/toggle-show`
    )) as ApiResponse<DonationQrCode>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '切换展示状态失败');
  },
};

export default adminFeedbackService;
