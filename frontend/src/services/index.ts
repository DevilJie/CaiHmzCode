/**
 * 服务层导出
 */
export { authService } from './auth';
export { projectService } from './project';
export { blogService } from './blog';
export type { BlogListParams } from './blog';
export { advertisementService } from './advertisement';
export type { AdListParams, AdRequest } from './advertisement';
export { feedbackService } from './feedback';
export { systemService } from './system';

// 管理端服务
export { adminProjectService } from './admin/project';
export type { ProjectRequest } from './admin/project';
export {
  adminBlogService,
  adminCategoryService,
  adminTagService,
} from './admin/blog';
export type {
  BlogRequest,
  CategoryRequest,
  TagRequest,
} from './admin/blog';
export { adminAdService } from './advertisement';
export {
  adminFeedbackService,
  adminDonationService,
} from './admin/feedback';
export type {
  FeedbackListParams,
  DonationQrcodeRequest,
} from './admin/feedback';
export { systemConfigService } from './admin/settings';
export { adminUserService } from './admin/user';
export type { UserListParams } from './admin/user';
export { dashboardService } from './admin/dashboard';
export { adminFileUploadService } from './admin/upload';
export type { UploadResponse } from './admin/upload';
