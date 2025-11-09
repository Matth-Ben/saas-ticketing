import { Router } from 'express';
import {
  getUserSettings,
  updateProfile,
  updatePreferences,
  updatePassword,
  toggle2FA,
  verify2FA,
  getUserSessions,
  revokeAllSessions,
  updateNotifications,
  updateFeatures,
  deleteAccount,
  getOrganizationSettings,
  updateOrganizationSettings,
  uploadAvatar as uploadAvatarController,
  deleteAvatar,
  exportUserData,
} from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { uploadAvatar } from '../config/multer';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

// General settings
router.get('/', getUserSettings);

// Profile
router.put('/profile', updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), uploadAvatarController);
router.delete('/avatar', deleteAvatar);

// Preferences
router.put('/preferences', updatePreferences);

// Security
router.put('/password', updatePassword);
router.post('/2fa', toggle2FA);
router.post('/2fa/verify', verify2FA);
router.get('/sessions', getUserSessions);
router.delete('/sessions', revokeAllSessions);

// Notifications
router.put('/notifications', updateNotifications);

// Features
router.put('/features', updateFeatures);

// Account deletion and data export
router.delete('/account', deleteAccount);
router.get('/export', exportUserData);

// Organization (Agency/Enterprise only)
router.get('/organization', getOrganizationSettings);
router.put('/organization', updateOrganizationSettings);

export default router;
