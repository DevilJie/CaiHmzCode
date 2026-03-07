'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { advertisementService } from '@/services';
import { Advertisement } from '@/types';

// 弹窗关闭状态的本地存储key
const POPUP_CLOSED_KEY = 'popup_ad_closed';
// 弹窗关闭后的过期时间（24小时）
const POPUP_EXPIRE_HOURS = 24;

/**
 * 弹窗广告组件
 * 首次访问时弹出，可关闭，记住关闭状态24小时
 */
export default function PopupAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);

  // 获取弹窗广告
  const { data: advertisements = [] } = useQuery({
    queryKey: ['advertisements', 'POPUP'],
    queryFn: () => advertisementService.getAdvertisements('POPUP'),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  useEffect(() => {
    // 没有广告则不显示
    if (!advertisements || advertisements.length === 0) {
      return;
    }

    // 检查是否在有效期内关闭过弹窗
    const closedTime = localStorage.getItem(POPUP_CLOSED_KEY);
    if (closedTime) {
      const elapsed = Date.now() - parseInt(closedTime, 10);
      const hoursElapsed = elapsed / (1000 * 60 * 60);
      if (hoursElapsed < POPUP_EXPIRE_HOURS) {
        return; // 未过期，不显示
      }
    }

    // 显示弹窗（延迟1秒，避免页面加载时立即弹出）
    const timer = setTimeout(() => {
      // 随机选择一个弹窗广告（按权重排序后的第一个）
      setCurrentAd(advertisements[0]);
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [advertisements]);

  // 关闭弹窗
  const handleClose = () => {
    setIsVisible(false);
    // 记录关闭时间
    localStorage.setItem(POPUP_CLOSED_KEY, Date.now().toString());
  };

  // 点击广告链接后关闭
  const handleAdClick = () => {
    handleClose();
  };

  // 不显示
  if (!isVisible || !currentAd) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 弹窗内容 */}
      <div className="relative z-10 max-w-lg w-full animate-scale-in">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          <span className="text-sm">关闭</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 广告内容 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {currentAd.linkUrl ? (
            <Link
              href={currentAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAdClick}
              className="block"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={currentAd.imageUrl}
                  alt={currentAd.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-secondary-800">
                  {currentAd.name}
                </h3>
              </div>
            </Link>
          ) : (
            <div>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={currentAd.imageUrl}
                  alt={currentAd.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-secondary-800">
                  {currentAd.name}
                </h3>
              </div>
            </div>
          )}

          {/* 底部关闭提示 */}
          <div className="px-4 pb-4 text-center">
            <button
              onClick={handleClose}
              className="text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              24小时内不再显示
            </button>
          </div>
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
