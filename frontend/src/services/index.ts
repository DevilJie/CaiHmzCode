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
