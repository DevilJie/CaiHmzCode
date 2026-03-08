import apiClient from '@/lib/axios';
import {
  ApiResponse,
  PageParams,
  PageResult,
  Blog,
  BlogCategory,
  BlogTag,
} from '@/types';

// ==================== 博客管理API ====================

/**
 * 博客列表查询参数
 */
export interface BlogListParams extends PageParams {
  status?: number; // 0-草稿 1-已发布
  categoryId?: number;
}

/**
 * 创建/更新博客请求
 */
export interface BlogRequest {
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  tagIds: number[];
  coverImage?: string;
  videoUrl?: string;
  status?: number;
}

/**
 * 博客管理服务
 */
export const adminBlogService = {
  /**
   * 获取博客列表（含草稿）
   */
  async getBlogs(params?: BlogListParams): Promise<PageResult<Blog>> {
    const response = (await apiClient.get('/admin/blogs', {
      params,
    })) as ApiResponse<PageResult<Blog>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取博客列表失败');
  },

  /**
   * 获取博客详情
   */
  async getBlogById(id: number): Promise<Blog> {
    const response = (await apiClient.get(
      `/admin/blogs/${id}`
    )) as ApiResponse<Blog>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取博客详情失败');
  },

  /**
   * 新增博客
   */
  async createBlog(data: BlogRequest): Promise<Blog> {
    const response = (await apiClient.post(
      '/admin/blogs',
      data
    )) as ApiResponse<Blog>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '新增博客失败');
  },

  /**
   * 更新博客
   */
  async updateBlog(id: number, data: BlogRequest): Promise<Blog> {
    const response = (await apiClient.put(
      `/admin/blogs/${id}`,
      data
    )) as ApiResponse<Blog>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新博客失败');
  },

  /**
   * 删除博客
   */
  async deleteBlog(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/blogs/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除博客失败');
    }
  },

  /**
   * 发布博客
   */
  async publishBlog(id: number): Promise<void> {
    const response = (await apiClient.put(
      `/admin/blogs/${id}/publish`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '发布博客失败');
    }
  },

  /**
   * 取消发布博客
   */
  async unpublishBlog(id: number): Promise<void> {
    const response = (await apiClient.put(
      `/admin/blogs/${id}/unpublish`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '取消发布失败');
    }
  },
};

// ==================== 分类管理API ====================

/**
 * 创建/更新分类请求
 */
export interface CategoryRequest {
  name: string;
  sortOrder?: number;
}

/**
 * 分类管理服务
 */
export const adminCategoryService = {
  /**
   * 获取所有分类（不分页）
   */
  async getCategories(): Promise<BlogCategory[]> {
    const response = (await apiClient.get(
      '/admin/blog-categories/all'
    )) as ApiResponse<BlogCategory[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取分类列表失败');
  },

  /**
   * 获取分类列表（分页）
   */
  async getCategoriesPage(params?: PageParams): Promise<PageResult<BlogCategory>> {
    const response = (await apiClient.get('/admin/blog-categories', {
      params,
    })) as ApiResponse<PageResult<BlogCategory>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取分类列表失败');
  },

  /**
   * 创建分类
   */
  async createCategory(data: CategoryRequest): Promise<BlogCategory> {
    const response = (await apiClient.post(
      '/admin/blog-categories',
      data
    )) as ApiResponse<BlogCategory>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建分类失败');
  },

  /**
   * 更新分类
   */
  async updateCategory(id: number, data: CategoryRequest): Promise<BlogCategory> {
    const response = (await apiClient.put(
      `/admin/blog-categories/${id}`,
      data
    )) as ApiResponse<BlogCategory>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新分类失败');
  },

  /**
   * 删除分类
   */
  async deleteCategory(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/blog-categories/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除分类失败');
    }
  },
};

// ==================== 标签管理API ====================

/**
 * 创建/更新标签请求
 */
export interface TagRequest {
  name: string;
}

/**
 * 标签管理服务
 */
export const adminTagService = {
  /**
   * 获取所有标签（不分页）
   */
  async getTags(): Promise<BlogTag[]> {
    const response = (await apiClient.get(
      '/admin/blog-tags/all'
    )) as ApiResponse<BlogTag[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取标签列表失败');
  },

  /**
   * 获取标签列表（分页）
   */
  async getTagsPage(params?: PageParams): Promise<PageResult<BlogTag>> {
    const response = (await apiClient.get('/admin/blog-tags', {
      params,
    })) as ApiResponse<PageResult<BlogTag>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取标签列表失败');
  },

  /**
   * 创建标签
   */
  async createTag(data: TagRequest): Promise<BlogTag> {
    const response = (await apiClient.post(
      '/admin/blog-tags',
      data
    )) as ApiResponse<BlogTag>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建标签失败');
  },

  /**
   * 更新标签
   */
  async updateTag(id: number, data: TagRequest): Promise<BlogTag> {
    const response = (await apiClient.put(
      `/admin/blog-tags/${id}`,
      data
    )) as ApiResponse<BlogTag>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新标签失败');
  },

  /**
   * 删除标签
   */
  async deleteTag(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/blog-tags/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除标签失败');
    }
  },
};

export default adminBlogService;
