import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';

export const settingsService = {
  // Get or create user settings
  async getUserSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  },

  // Update user profile
  async updateProfile(userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        avatar: true,
        role: true,
      },
    });

    return user;
  },

  // Update user preferences
  async updatePreferences(userId: string, preferences: {
    language?: string;
    timezone?: string;
    theme?: string;
  }) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    });

    return settings;
  },

  // Update password
  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      throw new Error('Utilisateur non trouvé');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  // Toggle 2FA
  async toggle2FA(userId: string, enable: boolean) {
    if (enable) {
      // TODO: Generate 2FA secret using speakeasy or similar library
      const secret = 'TEMPORARY_SECRET'; // Replace with actual secret generation

      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: secret,
        },
      });

      return {
        message: '2FA activé avec succès',
        secret, // In production, return QR code data
      };
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
        },
      });

      return { message: '2FA désactivé avec succès' };
    }
  },

  // Get user sessions
  async getUserSessions(userId: string) {
    const sessions = await prisma.userSession.findMany({
      where: {
        userId,
        logoutAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { loginAt: 'desc' },
      select: {
        id: true,
        device: true,
        browser: true,
        ipAddress: true,
        loginAt: true,
        lastActiveAt: true,
      },
    });

    return sessions;
  },

  // Revoke all sessions
  async revokeAllSessions(userId: string) {
    await prisma.userSession.updateMany({
      where: {
        userId,
        logoutAt: null,
      },
      data: {
        logoutAt: new Date(),
      },
    });
  },

  // Update notification settings
  async updateNotifications(userId: string, notificationSettings: {
    notificationsEmail?: boolean;
    notificationsInApp?: boolean;
    notificationsPush?: boolean;
    notifyOnTicketAssignment?: boolean;
    notifyOnComment?: boolean;
    notifyOnStatusChange?: boolean;
    notifyOnInvoice?: boolean;
    notifyOnPaymentFailed?: boolean;
    weeklyDigest?: boolean;
  }) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: notificationSettings,
      create: {
        userId,
        ...notificationSettings,
      },
    });

    return settings;
  },

  // Update feature flags
  async updateFeatures(userId: string, featureFlags: {
    enableQuotes?: boolean;
    enableTimeline?: boolean;
    enableDrive?: boolean;
    enableClientLink?: boolean;
    enableAnalytics?: boolean;
    enableTimeTracking?: boolean;
  }) {
    // Get user role and subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Validate feature access based on role
    if (featureFlags.enableTimeline && user.role === 'freelance') {
      throw new Error('La Timeline est restreinte aux plans Agence et Entreprise');
    }

    if (featureFlags.enableAnalytics && user.role !== 'enterprise') {
      throw new Error('Les Analytics sont restreints au plan Entreprise');
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: featureFlags,
      create: {
        userId,
        ...featureFlags,
      },
    });

    return settings;
  },

  // Delete account
  async deleteAccount(userId: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      throw new Error('Utilisateur non trouvé');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Mot de passe incorrect');
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: userId },
    });
  },

  // Get organization settings
  async getOrganizationSettings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        organizationId: true,
        organization: {
          include: {
            settings: true,
          },
        },
      },
    });

    if (!user || !user.organizationId) {
      throw new Error('Not authorized');
    }

    if (user.role === 'freelance') {
      throw new Error('Not authorized');
    }

    return user.organization?.settings;
  },

  // Update organization settings
  async updateOrganizationSettings(userId: string, orgSettingsData: {
    logo?: string;
    primaryColor?: string;
    require2FA?: boolean;
    requireStrongPassword?: boolean;
    enableTimeline?: boolean;
    enableAnalytics?: boolean;
    enableDrive?: boolean;
    enableIntegrations?: boolean;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        organizationId: true,
      },
    });

    if (!user || !user.organizationId) {
      throw new Error('Not authorized');
    }

    if (user.role === 'freelance') {
      throw new Error('Not authorized');
    }

    // Validate feature access based on organization type
    if (orgSettingsData.enableAnalytics && user.role !== 'enterprise') {
      throw new Error('Les Analytics sont restreints au plan Entreprise');
    }

    if (orgSettingsData.enableIntegrations && user.role !== 'enterprise') {
      throw new Error('Les Intégrations sont restreintes au plan Entreprise');
    }

    const settings = await prisma.organizationSettings.upsert({
      where: { organizationId: user.organizationId },
      update: orgSettingsData,
      create: {
        organizationId: user.organizationId,
        ...orgSettingsData,
      },
    });

    return settings;
  },
};
