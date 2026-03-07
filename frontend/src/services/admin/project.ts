import apiClient from '@/lib/axios';
import { ApiResponse, PageParams, PageResult, Project, ProjectDetail } from '@/types';

/**
 * 创建/更新项目请求
 */
export interface ProjectRequest {
  name: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  coverImage: string;
  techTags: string[];
  sortOrder: number;
  isShow: number;
  readmeUrl: string;
}

/**
 * 管理端项目服务
 * 处理项目的增删改查等API调用
 */
export const adminProjectService = {
  /**
   * 获取项目列表（分页，含搜索）
   */
  async getProjects(params?: PageParams): Promise<PageResult<Project>> {
    const response = (await apiClient.get('/admin/projects', {
      params,
    })) as ApiResponse<PageResult<Project>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取项目列表失败');
  },

  /**
   * 获取项目详情
   */
  async getProjectById(id: number): Promise<ProjectDetail> {
    const response = (await apiClient.get(
      `/admin/projects/${id}`
    )) as ApiResponse<ProjectDetail>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取项目详情失败');
  },

  /**
   * 创建项目
   */
  async createProject(data: ProjectRequest): Promise<Project> {
    const response = (await apiClient.post(
      '/admin/projects',
      data
    )) as ApiResponse<Project>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '创建项目失败');
  },

  /**
   * 更新项目
   */
  async updateProject(id: number, data: ProjectRequest): Promise<Project> {
    const response = (await apiClient.put(
      `/admin/projects/${id}`,
      data
    )) as ApiResponse<Project>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '更新项目失败');
  },

  /**
   * 删除项目
   */
  async deleteProject(id: number): Promise<void> {
    const response = (await apiClient.delete(
      `/admin/projects/${id}`
    )) as ApiResponse<void>;

    if (response.code !== 200) {
      throw new Error(response.message || '删除项目失败');
    }
  },

  /**
   * 同步README
   */
  async syncReadme(id: number): Promise<string> {
    const response = (await apiClient.post(
      `/admin/projects/${id}/sync-readme`
    )) as ApiResponse<string>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '同步README失败');
  },
};

export default adminProjectService;
