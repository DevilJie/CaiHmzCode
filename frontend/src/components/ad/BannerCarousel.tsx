'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { advertisementService } from '@/services';
import { Advertisement } from '@/types';

/**
 * 轮播广告组件
 * 首页轮播广告，支持自动轮播和手动切换
 */
export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 获取轮播广告
  const { data: advertisements = [] } = useQuery({
    queryKey: ['advertisements', 'BANNER'],
    queryFn: () => advertisementService.getAdvertisements('BANNER'),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || advertisements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === advertisements.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 每5秒切换

    return () => clearInterval(timer);
  }, [isAutoPlaying, advertisements.length]);

  // 手动切换
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // 3秒后恢复自动播放
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, advertisements.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, advertisements.length, goToSlide]);

  // 没有广告时不显示
  if (!advertisements || advertisements.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-secondary-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 轮播容器 */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {advertisements.map((ad: Advertisement) => (
          <div
            key={ad.id}
            className="w-full flex-shrink-0"
          >
            {ad.linkUrl ? (
              <Link
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-[3/1] w-full"
              >
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                />
                {/* 广告标题遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white text-lg font-semibold">{ad.name}</h3>
                </div>
              </Link>
            ) : (
              <div className="relative aspect-[3/1] w-full">
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white text-lg font-semibold">{ad.name}</h3>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 左右箭头（多个广告时显示） */}
      {advertisements.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-secondary-800 hover:bg-white shadow-lg transition-colors"
            aria-label="上一张"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-secondary-800 hover:bg-white shadow-lg transition-colors"
            aria-label="下一张"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器（多个广告时显示） */}
      {advertisements.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {advertisements.map((_: Advertisement, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`跳转到第${index + 1}张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
