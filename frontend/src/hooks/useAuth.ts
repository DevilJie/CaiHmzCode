'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * 认证Hook返回类型
 */
interface UseAuthReturn {
  /** 当前登录用户 */
  user: ReturnType<typeof useAuthContext>['user'];
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否是超级管理员 */
  isSuperAdmin: boolean;
  /** 登录方法 */
  login: ReturnType<typeof useAuthContext>['login'];
  /** 退出登录方法 */
  logout: ReturnType<typeof useAuthContext>['logout'];
  /** 刷新用户信息 */
  refreshUser: ReturnType<typeof useAuthContext>['refreshUser'];
  /** 检查登录状态并重定向 */
  checkAuth: (redirectToLogin?: boolean) => boolean;
  /** 是否正在检查认证 */
  isChecking: boolean;
}

/**
 * 认证相关Hook
 * 提供用户认证状态和操作方法
 */
export function useAuth(): UseAuthReturn {
  const authContext = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  /**
   * 检查登录状态
   * @param redirectToLogin 未登录时是否跳转到登录页
   * @returns 是否已登录
   */
  const checkAuth = useCallback(
    (redirectToLogin = true): boolean => {
      // 如果还在加载中，不进行检查
      if (authContext.isLoading) {
        setIsChecking(true);
        return false;
      }

      setIsChecking(false);

      if (!authContext.isAuthenticated) {
        if (redirectToLogin) {
          router.push('/admin/login');
        }
        return false;
      }

      return true;
    },
    [authContext.isLoading, authContext.isAuthenticated, router]
  );

  return {
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: authContext.isLoading,
    isSuperAdmin: authContext.isSuperAdmin,
    login: authContext.login,
    logout: authContext.logout,
    refreshUser: authContext.refreshUser,
    checkAuth,
    isChecking,
  };
}

/**
 * 需要认证的高阶Hook
 * 自动检查登录状态，未登录时跳转
 */
export function useRequireAuth(): UseAuthReturn {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 等待加载完成
    if (auth.isLoading) {
      return;
    }

    // 未登录时跳转到登录页
    if (!auth.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}

/**
 * 管理员权限检查Hook
 * 自动检查是否有管理员权限
 */
export function useAdminAuth(): UseAuthReturn & {
  /** 是否有管理权限 */
  hasAdminAccess: boolean;
} {
  const auth = useRequireAuth();

  return {
    ...auth,
    hasAdminAccess: auth.isAuthenticated,
  };
}

/**
 * 超级管理员权限检查Hook
 * 自动检查是否有超级管理员权限
 */
export function useSuperAdminAuth(): UseAuthReturn & {
  /** 是否有超级管理权限 */
  hasSuperAdminAccess: boolean;
} {
  const auth = useRequireAuth();

  return {
    ...auth,
    hasSuperAdminAccess: auth.isSuperAdmin,
  };
}

export default useAuth;
