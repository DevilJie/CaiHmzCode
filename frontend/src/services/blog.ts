import apiClient from '@/lib/axios';
import { ApiResponse, PageParams, PageResult, Blog, BlogCategory, BlogTag } from '@/types';

/**
 * 博客列表请求参数
 */
export interface BlogListParams extends PageParams {
  categoryId?: number;
  tagId?: number;
}

/**
 * 博客服务
 * 处理博客列表、详情、分类、标签等API调用
 */
export const blogService = {
  /**
   * 获取博客列表（分页）
   */
  async getBlogs(params?: BlogListParams): Promise<PageResult<Blog>> {
    const response = (await apiClient.get('/blogs', {
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
      `/blogs/${id}`
    )) as ApiResponse<Blog>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取博客详情失败');
  },

  /**
   * 增加博客浏览次数
   */
  async incrementViewCount(id: number): Promise<void> {
    try {
      await apiClient.post(`/blogs/${id}/view`);
    } catch {
      // 浏览次数增加失败不影响用户体验，静默处理
      console.warn('增加浏览次数失败');
    }
  },

  /**
   * 获取博客分类列表
   */
  async getCategories(): Promise<BlogCategory[]> {
    const response = (await apiClient.get(
      '/blog-categories'
    )) as ApiResponse<BlogCategory[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取分类列表失败');
  },

  /**
   * 获取博客标签列表
   */
  async getTags(): Promise<BlogTag[]> {
    const response = (await apiClient.get(
      '/blog-tags'
    )) as ApiResponse<BlogTag[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取标签列表失败');
  },

  /**
   * 获取相关博客推荐
   */
  async getRelatedBlogs(id: number, limit?: number): Promise<Blog[]> {
    const response = (await apiClient.get(`/blogs/${id}/related`, {
      params: { limit: limit || 5 },
    })) as ApiResponse<Blog[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    // 相关博客获取失败返回空数组
    return [];
  },
};

export default blogService;
