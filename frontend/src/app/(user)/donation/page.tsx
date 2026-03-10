'use client';

import { useState, useEffect } from 'react';
import { feedbackService } from '@/services/feedback';
import { useToast } from '@/contexts/ToastContext';

/**
 * 打赏页面
 * Editorial Magazine 风格
 */
export default function DonationPage() {
  const { showError } = useToast();
  const [qrcodes, setQrcodes] = useState<Array<{
    id: number;
    type: string;
    qrcodeUrl: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // 获取收款码
  useEffect(() => {
    const loadQrcodes = async () => {
      try {
        const data = await feedbackService.getDonationQrcodes();
        setQrcodes(data || []);
      } catch {
        console.error('加载收款码失败');
      } finally {
        setLoading(false);
      }
    };
    loadQrcodes();
  }, []);

  // 获取收款码类型的中文名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'WECHAT':
        return '微信支付';
      case 'ALIPAY':
        return '支付宝';
      default:
        return type;
    }
  };

  // 获取收款码类型的颜色配置
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'WECHAT':
        return {
          gradient: 'from-green-500 to-emerald-500',
          shadow: 'shadow-green-200',
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
            </svg>
          ),
        };
      case 'ALIPAY':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          shadow: 'shadow-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.422 15.358c-1.426-.511-4.398-1.543-6.268-2.356.694-1.274 1.248-2.67 1.612-4.146h-4.326V7.49h5.246V6.236H12.44V3.93h-2.338c-.305 0-.492.197-.492.492v1.814H4.389V7.49h5.221v1.366H5.02v1.156h9.258c-.266.946-.621 1.843-1.05 2.676-1.905-.753-4.639-1.612-6.795-1.612-2.835 0-4.433 1.426-4.433 3.045 0 1.98 1.938 3.396 4.633 3.396 2.552 0 4.727-1.142 6.433-3.074 2.153 1.07 6.35 2.55 6.35 2.55L21.422 15.358zM6.537 16.806c-1.583 0-2.443-.64-2.443-1.548 0-.897.895-1.398 2.152-1.398 1.617 0 3.532.547 5.098 1.392C9.915 16.344 8.258 16.806 6.537 16.806z" />
            </svg>
          ),
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          shadow: 'shadow-slate-200',
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          {/* 图标 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-xl shadow-rose-200 mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            支持作者
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/60 mt-2">
              感谢您的支持与鼓励
            </span>
          </h1>

          {/* 描述 */}
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            如果我的内容对您有帮助，欢迎打赏支持！您的每一份支持都是我持续创作的最大动力。
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 二维码卡片 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : qrcodes.length > 0 ? (
          <div className={`grid gap-6 ${qrcodes.length === 1 ? 'max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {qrcodes.map((qrcode) => {
              const config = getTypeConfig(qrcode.type);
              return (
                <div
                  key={qrcode.id}
                  className="group bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-100 dark:border-dark-700 hover:border-slate-200 dark:hover:border-dark-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-dark-900/50 transition-all duration-500 relative"
                >
                  {/* 头部 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg ${config.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-dark-100">
                        {getTypeName(qrcode.type)}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-dark-400">扫码打赏支持</p>
                    </div>
                  </div>

                  {/* 二维码图片 */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-dark-700 rounded-xl overflow-hidden border border-slate-100 dark:border-dark-600">
                    <img
                      src={qrcode.qrcodeUrl}
                      alt={getTypeName(qrcode.type)}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* 提示 */}
                  <p className={`text-center text-sm ${config.text} dark:${config.text.replace('700', '400')} mt-4 font-medium`}>
                    扫描{getTypeName(qrcode.type)}二维码打赏
                  </p>

                  {/* 底部渐变条 */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无收款码</h3>
            <p className="text-slate-500">管理员尚未配置收款码</p>
          </div>
        )}

        {/* 感谢说明 */}
        <div className="mt-12 bg-gradient-to-r from-rose-50 via-white to-pink-50 rounded-2xl p-8 border border-rose-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">感谢您的支持</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  您的每一份支持都是对我最大的鼓励
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  打赏金额不限，心意最重要
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  感谢所有支持者，是你们让我有动力继续前行
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
