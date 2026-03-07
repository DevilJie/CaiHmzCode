import axios from 'axios';

/**
 * Axios 实例配置
 * 用于与后端API通信
 */
const apiClient = axios.create({
  // API基础路径，通过Next.js代理到后端
  baseURL: '/api/v1',
  // 请求超时时间
  timeout: 30000,
  // 请求头配置
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加Token
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token（客户端环境）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 提取错误信息
    const errorMessage = error.response?.data?.message || error.message || '请求失败';
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;

    // 处理401未授权错误（仅在非登录请求时跳转）
    if (error.response?.status === 401) {
      // 清除token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // 如果在管理端且不是登录页面，跳转到登录页
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
