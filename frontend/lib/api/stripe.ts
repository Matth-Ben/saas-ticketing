import { apiClient } from './client';

export interface Subscription {
  id: string;
  plan: 'perso' | 'agence' | 'entreprise';
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  billingPeriod: 'month' | 'year';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
}

export const stripeApi = {
  // TODO: Implement createCheckoutSession
  async createCheckoutSession(planId: string, billingPeriod: 'month' | 'year'): Promise<{ url: string }> {
    const response = await apiClient.post('/stripe/checkout', { planId, billingPeriod });
    return response.data;
  },

  // TODO: Implement createPortalSession
  async createPortalSession(): Promise<{ url: string }> {
    const response = await apiClient.post('/stripe/portal');
    return response.data;
  },

  // TODO: Implement getSubscription
  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get('/stripe/subscription');
    return response.data;
  },
};

