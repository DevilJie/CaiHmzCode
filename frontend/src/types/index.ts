/**
 * API通用响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page?: number;
  size?: number;
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  techTag?: string;
}

/**
 * 分页响应数据
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

// ==================== 用户相关 ====================

/**
 * 用户角色
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

/**
 * 用户信息
 */
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: number;
  lastLoginTime: string;
  createTime: string;
}

/**
 * 登录请求
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  user: User;
  userInfo?: User; // 兼容后端可能返回的字段名
}

// ==================== 项目相关 ====================

/**
 * 项目信息
 */
export interface Project {
  id: number;
  name: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  coverImage: string;
  techTags: string[];
  sortOrder: number;
  isShow: number;
  viewCount: number;
  createTime: string;
  updateTime: string;
}

/**
 * 项目详情（包含README）
 */
export interface ProjectDetail extends Project {
  readmeContent: string;
}

// ==================== 博客相关 ====================

/**
 * 博客分类
 */
export interface BlogCategory {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * 博客标签
 */
export interface BlogTag {
  id: number;
  name: string;
}

/**
 * 博客文章
 */
export interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  categoryName: string;
  tags: BlogTag[];
  coverImage: string;
  videoUrl: string;
  status: number;
  publishTime: string;
  viewCount: number;
  createTime: string;
  updateTime: string;
}

// ==================== 反馈相关 ====================

/**
 * 意见反馈
 */
export interface Feedback {
  id: number;
  name: string;
  email: string;
  qq: string;
  wechat: string;
  content: string;
  isRead: number;
  createTime: string;
}

/**
 * 提交反馈请求
 */
export interface SubmitFeedbackRequest {
  name?: string;
  email?: string;
  qq?: string;
  wechat?: string;
  content: string;
}

// ==================== 打赏相关 ====================

/**
 * 收款码类型
 */
export type QrCodeType = 'WECHAT' | 'ALIPAY';

/**
 * 收款码
 */
export interface DonationQrCode {
  id: number;
  type: QrCodeType;
  name: string;
  qrcodeUrl: string;
  isShow: number;
  sortOrder: number;
}

// ==================== 广告相关 ====================

/**
 * 广告位类型
 */
export type AdPosition = 'BANNER' | 'POPUP';

/**
 * 广告信息
 */
export interface Advertisement {
  id: number;
  position: AdPosition;
  name: string;
  imageUrl: string;
  linkUrl: string;
  weight: number;
  startTime: string;
  endTime: string;
  status: number;
  createTime: string;
  updateTime: string;
}

// ==================== 系统配置相关 ====================

/**
 * 系统配置
 */
export interface SystemConfig {
  configKey: string;
  configValue: string;
  configName: string;
  description: string;
}

/**
 * 导航栏配置
 */
export interface NavConfig {
  home: boolean;
  projects: boolean;
  blogs: boolean;
  feedback: boolean;
  donation: boolean;
}

/**
 * 网站信息
 */
export interface SiteInfo {
  siteName: string;
  icpNumber: string;
  footerText: string;
  logoType: 'text' | 'image';
  logoImageUrl: string;
  navConfig: NavConfig;
}

// ==================== 系统配置扩展 ====================

/**
 * 系统配置响应
 */
export interface SystemConfigResponse {
  siteName: string;
  icpNumber: string;
  footerText: string;
  githubToken: string;
  logoType?: 'text' | 'image';
  logoImageUrl?: string;
  navHomeEnabled?: boolean;
  navProjectsEnabled?: boolean;
  navBlogsEnabled?: boolean;
  navFeedbackEnabled?: boolean;
  navDonationEnabled?: boolean;
  configs: SystemConfig[];
}

/**
 * 系统配置更新请求
 */
export interface SystemConfigRequest {
  siteName: string;
  icpNumber?: string;
  footerText?: string;
  githubToken?: string;
  logoType?: 'text' | 'image';
  logoImageUrl?: string;
  navHomeEnabled?: boolean;
  navProjectsEnabled?: boolean;
  navBlogsEnabled?: boolean;
  navFeedbackEnabled?: boolean;
  navDonationEnabled?: boolean;
}

// ==================== 用户管理相关 ====================

/**
 * 用户响应
 */
export interface UserResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: number;
  lastLoginTime: string;
  createTime: string;
}

/**
 * 创建用户请求
 */
export interface UserCreateRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  role: UserRole;
}

/**
 * 更新用户请求
 */
export interface UserUpdateRequest {
  nickname?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  status?: number;
  password?: string;
}

// ==================== 仪表盘统计相关 ====================

/**
 * 仪表盘统计数据
 */
export interface DashboardStats {
  blogStats: {
    total: number;
    published: number;
    draft: number;
  };
  projectStats: {
    total: number;
    visible: number;
  };
  feedbackStats: {
    total: number;
    unread: number;
  };
  recentFeedbacks: Array<{
    id: number;
    name: string;
    content: string;
    isRead: number;
    createTime: string;
  }>;
}
