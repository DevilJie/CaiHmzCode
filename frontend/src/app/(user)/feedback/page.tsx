'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { feedbackService } from '@/services/feedback';
import { SubmitFeedbackRequest } from '@/types';

/**
 * 意见反馈页面
 */
export default function FeedbackPage() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubmitFeedbackRequest>({
    name: '',
    email: '',
    qq: '',
    wechat: '',
    content: '',
  });

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      showError('请输入反馈内容');
      return;
    }

    setLoading(true);
    try {
      await feedbackService.submitFeedback(formData);
      showSuccess('提交成功，感谢您的反馈！');
      // 清空表单
      setFormData({
        name: '',
        email: '',
        qq: '',
        wechat: '',
        content: '',
      });
    } catch {
      showError('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">意见反馈</h1>

      <div className="card">
        <p className="text-secondary-600 mb-6">
          感谢您使用我们的服务！如果您有任何建议、问题或想法，请随时告诉我们。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              姓名（选填）
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-base"
              placeholder="您的姓名"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              邮箱（选填）
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-base"
              placeholder="您的邮箱"
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                QQ（选填）
              </label>
              <input
                type="text"
                name="qq"
                value={formData.qq}
                onChange={handleChange}
                className="input-base"
                placeholder="您的QQ号"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                微信（选填）
              </label>
              <input
                type="text"
                name="wechat"
                value={formData.wechat}
                onChange={handleChange}
                className="input-base"
                placeholder="您的微信号"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              反馈内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input-base min-h-[150px]"
              placeholder="请输入您的反馈内容..."
              required
              maxLength={2000}
            />
            <p className="text-xs text-secondary-400 mt-1 text-right">
              {formData.content.length}/2000
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '提交中...' : '提交反馈'}
          </button>
        </form>
      </div>

      {/* 反馈说明 */}
      <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
        <h3 className="font-medium text-secondary-800 mb-2">反馈说明</h3>
        <ul className="text-sm text-secondary-600 space-y-1">
          <li>我们会在1-3个工作日内处理您的反馈</li>
          <li>如果您留下了联系方式，我们可能会与您取得联系</li>
          <li>您的反馈将帮助我们改进产品和服务</li>
        </ul>
      </div>
    </div>
  );
}
