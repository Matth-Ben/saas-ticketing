import { apiClient } from './client';

export interface UserSettings {
  language?: string;
  timezone?: string;
  theme?: string;
  notificationsEmail?: boolean;
  notificationsInApp?: boolean;
  notificationsPush?: boolean;
  notifyOnTicketAssignment?: boolean;
  notifyOnComment?: boolean;
  notifyOnStatusChange?: boolean;
  notifyOnInvoice?: boolean;
  notifyOnPaymentFailed?: boolean;
  weeklyDigest?: boolean;
  enableQuotes?: boolean;
  enableTimeline?: boolean;
  enableDrive?: boolean;
  enableClientLink?: boolean;
  enableAnalytics?: boolean;
  enableTimeTracking?: boolean;
}

export interface Session {
  id: string;
  device: string | null;
  browser: string | null;
  ipAddress: string | null;
  loginAt: string;
  lastActiveAt: string;
}

export const settingsApi = {
  // Get user settings
  getUserSettings: async () => {
    const response = await apiClient.get<UserSettings>('/settings');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => {
    const response = await apiClient.put('/settings/profile', data);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (data: { language?: string; timezone?: string; theme?: string }) => {
    const response = await apiClient.put('/settings/preferences', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/settings/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await apiClient.delete('/settings/avatar');
    return response.data;
  },

  // Update password
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/settings/password', data);
    return response.data;
  },

  // Toggle 2FA
  toggle2FA: async (enable: boolean) => {
    const response = await apiClient.post('/settings/2fa', { enable });
    return response.data;
  },

  // Verify 2FA
  verify2FA: async (token: string) => {
    const response = await apiClient.post('/settings/2fa/verify', { token });
    return response.data;
  },

  // Get user sessions
  getSessions: async () => {
    const response = await apiClient.get<Session[]>('/settings/sessions');
    return response.data;
  },

  // Revoke all sessions
  revokeAllSessions: async () => {
    const response = await apiClient.delete('/settings/sessions');
    return response.data;
  },

  // Update notification settings
  updateNotifications: async (data: Partial<UserSettings>) => {
    const response = await apiClient.put('/settings/notifications', data);
    return response.data;
  },

  // Update feature settings
  updateFeatures: async (data: Partial<UserSettings>) => {
    const response = await apiClient.put('/settings/features', data);
    return response.data;
  },

  // Export user data
  exportUserData: async () => {
    const response = await apiClient.get('/settings/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};
