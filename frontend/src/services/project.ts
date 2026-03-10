import apiClient from '@/lib/axios';
import { ApiResponse, PageParams, PageResult, Project, ProjectDetail } from '@/types';

/**
 * 项目服务
 * 处理项目列表、详情、浏览次数等API调用
 */
export const projectService = {
  /**
   * 获取项目列表（分页）
   */
  async getProjects(params?: PageParams & { tech?: string }): Promise<PageResult<Project>> {
    const response = (await apiClient.get('/projects', {
      params,
    })) as ApiResponse<PageResult<Project>>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取项目列表失败');
  },

  /**
   * 获取所有技术栈列表
   */
  async getTechStacks(): Promise<string[]> {
    const response = (await apiClient.get('/projects/tech-stacks')) as ApiResponse<string[]>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    return [];
  },

  /**
   * 获取项目详情
   */
  async getProjectById(id: number): Promise<ProjectDetail> {
    const response = (await apiClient.get(
      `/projects/${id}`
    )) as ApiResponse<ProjectDetail>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || '获取项目详情失败');
  },

  /**
   * 增加项目浏览次数
   */
  async incrementViewCount(id: number): Promise<void> {
    try {
      await apiClient.post(`/projects/${id}/view`);
    } catch {
      // 浏览次数增加失败不影响用户体验，静默处理
      console.warn('增加浏览次数失败');
    }
  },
};

export default projectService;
