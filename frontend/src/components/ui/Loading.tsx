'use client';

import clsx from 'clsx';

/**
 * Loading组件Props接口
 */
interface LoadingProps {
  /** 是否全屏显示 */
  fullScreen?: boolean;
  /** 加载提示文字 */
  text?: string;
  /** 加载动画大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 自定义类名 */
  className?: string;
}

/**
 * 尺寸映射
 */
const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

/**
 * Loading加载组件
 *
 * @example
 * // 全屏加载
 * <Loading fullScreen text="加载中..." />
 *
 * // 局部加载
 * <Loading size="sm" text="处理中..." />
 */
export default function Loading({
  fullScreen = false,
  text = '加载中...',
  size = 'md',
  className,
}: LoadingProps) {
  const spinner = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      {/* 旋转加载动画 */}
      <div className={clsx('relative', sizeMap[size])}>
        {/* 外圈 */}
        <div
          className={clsx(
            'absolute inset-0 border-4 border-primary-200 rounded-full',
            sizeMap[size]
          )}
        />
        {/* 旋转部分 */}
        <div
          className={clsx(
            'absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin',
            sizeMap[size]
          )}
        />
      </div>

      {/* 加载文字 */}
      {text && (
        <p className="text-secondary-600 text-sm font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  // 全屏模式
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * 页面加载组件
 * 用于页面级别的加载状态
 */
export function PageLoading({ text = '页面加载中...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

/**
 * 内联加载组件
 * 用于组件内部的加载状态
 */
export function InlineLoading({
  text,
  size = 'sm',
}: {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return <Loading size={size} text={text} className="py-4" />;
}
