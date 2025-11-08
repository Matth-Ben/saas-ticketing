import { apiClient } from './client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  // TODO: Implement getProjects
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // TODO: Implement getProject
  async getProject(id: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // TODO: Implement createProject
  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  // TODO: Implement updateProject
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  // TODO: Implement deleteProject
  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};

