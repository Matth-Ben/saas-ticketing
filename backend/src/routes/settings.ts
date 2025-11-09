import { Router } from 'express';
import {
  getUserSettings,
  updateProfile,
  updatePreferences,
  updatePassword,
  toggle2FA,
  getUserSessions,
  revokeAllSessions,
  updateNotifications,
  updateFeatures,
  deleteAccount,
  getOrganizationSettings,
  updateOrganizationSettings,
} from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

// General settings
router.get('/', getUserSettings);

// Profile
router.put('/profile', updateProfile);

// Preferences
router.put('/preferences', updatePreferences);

// Security
router.put('/password', updatePassword);
router.post('/2fa', toggle2FA);
router.get('/sessions', getUserSessions);
router.delete('/sessions', revokeAllSessions);

// Notifications
router.put('/notifications', updateNotifications);

// Features
router.put('/features', updateFeatures);

// Account deletion
router.delete('/account', deleteAccount);

// Organization (Agency/Enterprise only)
router.get('/organization', getOrganizationSettings);
router.put('/organization', updateOrganizationSettings);

export default router;
