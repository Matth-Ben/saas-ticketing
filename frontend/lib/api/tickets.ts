import { apiClient } from './client';

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  estimatedTime?: number;
  spentTime: number;
  createdAt: string;
  updatedAt: string;
}

export const ticketsApi = {
  // TODO: Implement getTickets
  async getTickets(projectId?: string): Promise<Ticket[]> {
    const params = projectId ? { projectId } : {};
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  },

  // TODO: Implement getTicket
  async getTicket(id: string): Promise<Ticket> {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  // TODO: Implement createTicket
  async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    const response = await apiClient.post('/tickets', data);
    return response.data;
  },

  // TODO: Implement updateTicket
  async updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    const response = await apiClient.put(`/tickets/${id}`, data);
    return response.data;
  },

  // TODO: Implement deleteTicket
  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`/tickets/${id}`);
  },

  // TODO: Implement updateTicketStatus
  async updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket> {
    const response = await apiClient.patch(`/tickets/${id}/status`, { status });
    return response.data;
  },

  // TODO: Implement startTimeTracking
  async startTimeTracking(id: string): Promise<void> {
    await apiClient.post(`/tickets/${id}/time-tracking/start`);
  },

  // TODO: Implement stopTimeTracking
  async stopTimeTracking(id: string): Promise<Ticket> {
    const response = await apiClient.post(`/tickets/${id}/time-tracking/stop`);
    return response.data;
  },
};

