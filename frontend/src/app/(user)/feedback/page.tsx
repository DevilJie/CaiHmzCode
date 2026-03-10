'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { feedbackService } from '@/services/feedback';
import { SubmitFeedbackRequest } from '@/types';

/**
 * 意见反馈页面
 * Editorial Magazine 风格
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          {/* 图标 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-xl shadow-emerald-200 mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            意见反馈
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/60 mt-2">
              我们重视您的每一条建议
            </span>
          </h1>

          {/* 描述 */}
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            感谢您使用我们的服务！如果您有任何建议、问题或想法，请随时告诉我们。
          </p>
        </div>

        {/* 底部波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-slate-50 dark:fill-dark-900">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8">
          {/* 表单卡片 */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-dark-700/50 shadow-lg shadow-slate-200/50 dark:shadow-dark-900/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* 姓名和邮箱 - 并排 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-dark-200 mb-2">
                    姓名
                    <span className="text-slate-400 dark:text-dark-500 font-normal ml-1">(选填)</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-dark-200"
                    placeholder="您的姓名"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-dark-200 mb-2">
                    邮箱
                    <span className="text-slate-400 dark:text-dark-500 font-normal ml-1">(选填)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-dark-200"
                    placeholder="your@email.com"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* QQ和微信 - 并排 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-dark-200 mb-2">
                    QQ
                    <span className="text-slate-400 dark:text-dark-500 font-normal ml-1">(选填)</span>
                  </label>
                  <input
                    type="text"
                    name="qq"
                    value={formData.qq}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-dark-200"
                    placeholder="您的QQ号"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-dark-200 mb-2">
                    微信
                    <span className="text-slate-400 dark:text-dark-500 font-normal ml-1">(选填)</span>
                  </label>
                  <input
                    type="text"
                    name="wechat"
                    value={formData.wechat}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-dark-200"
                    placeholder="您的微信号"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* 反馈内容 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-200 mb-2">
                  反馈内容
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-[180px] resize-none dark:text-dark-200"
                    placeholder="请详细描述您的问题或建议..."
                    required
                    maxLength={2000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-dark-500">
                    {formData.content.length}/2000
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    提交中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    提交反馈
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 反馈说明卡片 */}
          <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-dark-800 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-dark-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-dark-100 mb-3">反馈说明</h3>
                <ul className="space-y-2 text-slate-600 dark:text-dark-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    我们会在1-3个工作日内处理您的反馈
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    如果您留下了联系方式，我们可能会与您取得联系
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    您的反馈将帮助我们改进产品和服务
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
