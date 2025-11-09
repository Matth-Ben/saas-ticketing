import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { settingsService } from '../services/settingsService';
import path from 'path';
import fs from 'fs';

// Get user settings
export const getUserSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const settings = await settingsService.getUserSettings(userId);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { firstName, lastName, phoneNumber, avatar } = req.body;

    const updatedUser = await settingsService.updateProfile(userId, {
      firstName,
      lastName,
      phoneNumber,
      avatar,
    });

    res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Update preferences (language, timezone, theme)
export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { language, timezone, theme } = req.body;

    const updatedSettings = await settingsService.updatePreferences(userId, {
      language,
      timezone,
      theme,
    });

    res.json({ message: 'Préférences mises à jour avec succès', settings: updatedSettings });
  } catch (error) {
    next(error);
  }
};

// Update password
export const updatePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mots de passe requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
      });
    }

    await settingsService.updatePassword(userId, currentPassword, newPassword);

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error: any) {
    if (error.message === 'Mot de passe actuel incorrect') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Enable/Disable 2FA
export const toggle2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { enable } = req.body;

    const result = await settingsService.toggle2FA(userId, enable);

    res.json(result);
  } catch (error: any) {
    if (error.message === '2FA déjà activé') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Verify 2FA code
export const verify2FA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Code requis' });
    }

    const result = await settingsService.verify2FA(userId, token);

    res.json(result);
  } catch (error: any) {
    if (error.message === 'Code invalide' || error.message === '2FA non configuré') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get user sessions
export const getUserSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const sessions = await settingsService.getUserSessions(userId);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Revoke all sessions
export const revokeAllSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await settingsService.revokeAllSessions(userId);
    res.json({ message: 'Toutes les sessions ont été révoquées' });
  } catch (error) {
    next(error);
  }
};

// Update notification settings
export const updateNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notificationSettings = req.body;

    const updatedSettings = await settingsService.updateNotifications(userId, notificationSettings);

    res.json({ message: 'Préférences de notification mises à jour', settings: updatedSettings });
  } catch (error) {
    next(error);
  }
};

// Update feature flags
export const updateFeatures = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const featureFlags = req.body;

    const updatedSettings = await settingsService.updateFeatures(userId, featureFlags);

    res.json({ message: 'Modules mis à jour avec succès', settings: updatedSettings });
  } catch (error: any) {
    if (error.message.includes('restricted')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

// Delete user account
export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis pour supprimer le compte' });
    }

    await settingsService.deleteAccount(userId, password);

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error: any) {
    if (error.message === 'Mot de passe incorrect') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get organization settings (for agency/enterprise)
export const getOrganizationSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orgSettings = await settingsService.getOrganizationSettings(userId);
    res.json(orgSettings);
  } catch (error: any) {
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    next(error);
  }
};

// Update organization settings
export const updateOrganizationSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orgSettingsData = req.body;

    const updatedSettings = await settingsService.updateOrganizationSettings(userId, orgSettingsData);

    res.json({ message: 'Paramètres de l\'organisation mis à jour', settings: updatedSettings });
  } catch (error: any) {
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    next(error);
  }
};

// Upload avatar
export const uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    // Generate URL for the avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar in database
    const updatedUser = await settingsService.updateProfile(userId, {
      avatar: avatarUrl,
    });

    res.json({
      message: 'Avatar mis à jour avec succès',
      avatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    // Delete uploaded file if database update fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/avatars', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Delete avatar
export const deleteAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Get current avatar
    const user = await settingsService.updateProfile(userId, {});

    if (user.avatar) {
      // Delete file from disk
      const filename = path.basename(user.avatar);
      const filePath = path.join(__dirname, '../../uploads/avatars', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove avatar from database
    const updatedUser = await settingsService.updateProfile(userId, {
      avatar: undefined,
    });

    res.json({ message: 'Avatar supprimé avec succès', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Export user data (RGPD)
export const exportUserData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const data = await settingsService.exportUserData(userId);

    // Set headers for JSON download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.json"`);

    res.json(data);
  } catch (error) {
    next(error);
  }
};
