'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { User, LoginRequest, LoginResponse, ApiResponse } from '@/types';

/**
 * 认证上下文接口
 */
interface AuthContextType {
  /** 当前登录用户 */
  user: User | null;
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否是超级管理员 */
  isSuperAdmin: boolean;
  /** 登录方法 */
  login: (credentials: LoginRequest) => Promise<void>;
  /** 退出登录方法 */
  logout: () => void;
  /** 刷新用户信息 */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Token存储键名 */
const TOKEN_KEY = 'auth_token';
/** 用户信息存储键名 */
const USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证上下文提供者
 * 管理全局认证状态
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * 从本地存储恢复用户状态
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('恢复用户状态失败:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 登录方法
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = (await apiClient.post(
        '/admin/auth/login',
        credentials
      )) as ApiResponse<LoginResponse>;

      if (response.code === 200 && response.data) {
        // 兼容后端返回 user 或 userInfo 字段
        const { token, user, userInfo } = response.data;
        const userData = user || userInfo;

        if (!userData) {
          throw new Error('登录响应中缺少用户信息');
        }

        // 保存Token和用户信息到本地存储
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        setUser(userData);

        // 跳转到管理后台首页
        router.push('/admin');
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      // 清理存储
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      throw error;
    }
  }, [router]);

  /**
   * 退出登录方法
   */
  const logout = useCallback(() => {
    // 清理本地存储
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // 清理用户状态
    setUser(null);

    // 跳转到登录页
    router.push('/admin/login');
  }, [router]);

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = (await apiClient.get(
        '/admin/auth/profile'
      )) as ApiResponse<User>;

      if (response.code === 200 && response.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      // 获取用户信息失败，可能Token已过期
      logout();
      throw error;
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 使用认证上下文的Hook
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }

  return context;
}

export default AuthContext;
