'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { adminAdService, AdRequest } from '@/services/advertisement';
import { Advertisement, AdPosition } from '@/types';
import { adminFileUploadService } from '@/services/admin';

interface AdFormProps {
  ad?: Advertisement | null;
  isEdit?: boolean;
}

/**
 * 广告表单组件
 */
export default function AdForm({ ad, isEdit = false }: AdFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  // 表单数据
  const [formData, setFormData] = useState<AdRequest>({
    position: 'BANNER',
    name: '',
    imageUrl: '',
    linkUrl: '',
    weight: 1,
    startTime: '',
    endTime: '',
    status: 1,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (ad) {
      setFormData({
        position: ad.position as AdPosition,
        name: ad.name,
        imageUrl: ad.imageUrl,
        linkUrl: ad.linkUrl || '',
        weight: ad.weight,
        startTime: ad.startTime ? formatDateTimeLocal(ad.startTime) : '',
        endTime: ad.endTime ? formatDateTimeLocal(ad.endTime) : '',
        status: ad.status,
      });
    }
  }, [ad]);

  // 格式化日期为datetime-local格式
  const formatDateTimeLocal = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // 图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showError('请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showError('图片大小不能超过5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await adminFileUploadService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: response.url,
      }));
      showSuccess('图片上传成功');
    } catch {
      showError('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.name.trim()) {
      showError('请输入广告名称');
      return;
    }
    if (!formData.imageUrl) {
      showError('请上传广告图片');
      return;
    }

    setLoading(true);
    try {
      // 处理时间格式
      const submitData = {
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
      };

      if (isEdit && ad) {
        await adminAdService.updateAd(ad.id, submitData);
        showSuccess('更新成功');
      } else {
        await adminAdService.createAd(submitData);
        showSuccess('创建成功');
      }
      router.push('/admin/ads');
    } catch (err) {
      showError(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 广告位类型 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          广告位类型 <span className="text-red-500">*</span>
        </label>
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="BANNER">轮播广告</option>
          <option value="POPUP">弹窗广告</option>
        </select>
      </div>

      {/* 广告名称 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          广告名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入广告名称"
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* 广告图片 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          广告图片 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="mt-1 text-xs text-secondary-400">
              支持 JPG、PNG 格式，最大 5MB
            </p>
          </div>
          {formData.imageUrl && (
            <div className="relative w-32 h-20 rounded overflow-hidden border border-secondary-200">
              <img
                src={formData.imageUrl}
                alt="预览"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* 跳转链接 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          跳转链接
        </label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl}
          onChange={handleChange}
          placeholder="请输入跳转链接（可选）"
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* 展示权重 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          展示权重 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          min="1"
          max="100"
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-secondary-400">
          权重越大，展示优先级越高（1-100）
        </p>
      </div>

      {/* 展示时间范围 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            开始时间
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            结束时间
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
      <p className="text-xs text-secondary-400 -mt-4">
        不设置时间则永久有效
      </p>

      {/* 状态 */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          状态
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value={1}
              checked={formData.status === 1}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-secondary-700">启用</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value={0}
              checked={formData.status === 0}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-secondary-700">禁用</span>
          </label>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4 pt-4 border-t border-secondary-200">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-6 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '保存中...' : isEdit ? '保存修改' : '创建广告'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-secondary-200 text-secondary-600 text-sm font-medium rounded-lg hover:bg-secondary-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
