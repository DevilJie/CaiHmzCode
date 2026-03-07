'use client';

import { useState, useEffect } from 'react';
import { feedbackService } from '@/services/feedback';
import { DonationQrCode } from '@/types';

/**
 * 打赏页面
 */
export default function DonationPage() {
  const [qrcodes, setQrcodes] = useState<DonationQrCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQrcodes();
  }, []);

  const loadQrcodes = async () => {
    try {
      const data = await feedbackService.getDonationQrcodes();
      setQrcodes(data);
    } catch {
      console.error('加载收款码失败');
    } finally {
      setLoading(false);
    }
  };

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

  // 获取收款码类型的图标颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WECHAT':
        return 'bg-green-500';
      case 'ALIPAY':
        return 'bg-blue-500';
      default:
        return 'bg-secondary-500';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">支持作者</h1>

      <div className="card text-center">
        <p className="text-secondary-600 mb-6">
          如果我的内容对您有帮助，欢迎打赏支持！您的支持是我持续创作的动力。
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : qrcodes.length === 0 ? (
          <div className="py-12 text-secondary-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
            <p>暂无收款码</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qrcodes.map((qrcode) => (
              <div
                key={qrcode.id}
                className="p-4 bg-secondary-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span
                    className={`w-3 h-3 rounded-full ${getTypeColor(qrcode.type)}`}
                  />
                  <h3 className="font-semibold text-secondary-800">
                    {qrcode.name || getTypeName(qrcode.type)}
                  </h3>
                </div>
                <div className="w-48 h-48 mx-auto bg-white rounded-lg border border-secondary-200 overflow-hidden">
                  <img
                    src={qrcode.qrcodeUrl}
                    alt={getTypeName(qrcode.type)}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-secondary-500 mt-2">
                  扫描{getTypeName(qrcode.type)}二维码打赏
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 感谢说明 */}
      <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
        <h3 className="font-medium text-secondary-800 mb-2">感谢您的支持</h3>
        <ul className="text-sm text-secondary-600 space-y-1">
          <li>您的每一份支持都是对我最大的鼓励</li>
          <li>打赏金额不限，心意最重要</li>
          <li>感谢所有支持者，是你们让我有动力继续前行</li>
        </ul>
      </div>
    </div>
  );
}
