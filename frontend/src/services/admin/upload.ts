import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types';

/**
 * 文件上传响应
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

/**
 * 文件上传服务
 */
export const adminFileUploadService = {
  /**
   * 上传图片
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = (await apiClient.post('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as ApiResponse<UploadResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '上传失败');
  },

  /**
   * 上传文件
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = (await apiClient.post('/admin/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as ApiResponse<UploadResponse>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '上传失败');
  },
};

export default adminFileUploadService;
