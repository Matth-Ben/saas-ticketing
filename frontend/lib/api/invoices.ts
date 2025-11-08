import { apiClient } from './client';

export interface Invoice {
  id: string;
  type: 'invoice' | 'quote' | 'contract';
  number: string;
  projectId: string;
  amount: number;
  status: 'draft' | 'sent' | 'signed' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const invoicesApi = {
  // TODO: Implement getInvoices
  async getInvoices(projectId?: string): Promise<Invoice[]> {
    const params = projectId ? { projectId } : {};
    const response = await apiClient.get('/invoices', { params });
    return response.data;
  },

  // TODO: Implement getInvoice
  async getInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },

  // TODO: Implement createInvoice
  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  },

  // TODO: Implement updateInvoice
  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.put(`/invoices/${id}`, data);
    return response.data;
  },

  // TODO: Implement deleteInvoice
  async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },

  // TODO: Implement signInvoice
  async signInvoice(id: string, signatureData: any): Promise<Invoice> {
    const response = await apiClient.post(`/invoices/${id}/sign`, signatureData);
    return response.data;
  },
};

