import apiClient from '@/lib/axios';
import { ApiResponse, SubmitFeedbackRequest, Feedback, DonationQrCode } from '@/types';

/**
 * 反馈服务（用户端）
 */
export const feedbackService = {
  /**
   * 提交反馈
   */
  async submitFeedback(data: SubmitFeedbackRequest): Promise<Feedback> {
    const response = (await apiClient.post('/feedbacks', data)) as ApiResponse<Feedback>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '提交反馈失败');
  },

  /**
   * 获取收款码列表
   */
  async getDonationQrcodes(): Promise<DonationQrCode[]> {
    const response = (await apiClient.get(
      '/donation-qrcodes'
    )) as ApiResponse<DonationQrCode[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取收款码列表失败');
  },
};

export default feedbackService;
