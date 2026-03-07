'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Toast类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast配置接口
 */
export interface ToastConfig {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Toast Context接口
 */
interface ToastContextType {
  toasts: ToastConfig[];
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Toast Provider组件
 * 提供全局Toast状态管理
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  /**
   * 添加Toast
   */
  const addToast = useCallback(
    (type: ToastType, message: string, duration: number = 3000) => {
      const id = generateId();
      const newToast: ToastConfig = {
        id,
        type,
        message,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      // 自动移除
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  /**
   * 移除Toast
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * 显示成功提示
   */
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      addToast('success', message, duration);
    },
    [addToast]
  );

  /**
   * 显示错误提示
   */
  const showError = useCallback(
    (message: string, duration?: number) => {
      addToast('error', message, duration);
    },
    [addToast]
  );

  /**
   * 显示警告提示
   */
  const showWarning = useCallback(
    (message: string, duration?: number) => {
      addToast('warning', message, duration);
    },
    [addToast]
  );

  /**
   * 显示信息提示
   */
  const showInfo = useCallback(
    (message: string, duration?: number) => {
      addToast('info', message, duration);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * 用于在组件中显示Toast提示
 *
 * @example
 * const { showSuccess, showError } = useToast();
 * showSuccess('操作成功！');
 * showError('操作失败！');
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
