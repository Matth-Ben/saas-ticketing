'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { settingsApi } from '@/lib/api/settings';

export function ProfileSection() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
      });
      // @ts-ignore - avatar might exist on user object
      setAvatar(user.avatar || null);

      // Load user settings only when user is available
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await settingsApi.getUserSettings();
      console.log('Loaded settings from API:', settings);
      setPreferences({
        language: settings.language || 'fr',
        timezone: settings.timezone || 'Europe/Paris',
      });
      // Sync theme from backend
      if (settings.theme) {
        console.log('Setting theme to:', settings.theme);
        setTheme(settings.theme as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updatedUser = await settingsApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = {
        ...currentUser,
        firstName: updatedUser.user.firstName,
        lastName: updatedUser.user.lastName,
        phoneNumber: updatedUser.user.phoneNumber,
      };
      localStorage.setItem('user', JSON.stringify(newUserData));

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour du profil' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await settingsApi.updatePreferences({ ...preferences, theme });
      setMessage({ type: 'success', text: 'Préférences mises à jour avec succès' });
      // Reload settings to ensure they are up to date
      await fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour des préférences' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Le fichier est trop volumineux (max 5MB)' });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.' });
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const data = await settingsApi.uploadAvatar(file);
      setAvatar(data.avatarUrl);
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de l\'upload de l\'avatar' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre avatar ?')) {
      return;
    }

    setMessage(null);

    try {
      await settingsApi.deleteAvatar();
      setAvatar(null);
      setMessage({ type: 'success', text: 'Avatar supprimé avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la suppression de l\'avatar' });
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setMessage(null);

    try {
      const blob = await settingsApi.exportUserData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Données exportées avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de l\'export des données' });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${avatar}`}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-3xl text-gray-400 dark:text-gray-300">
                  {user?.firstName?.[0] || user?.email?.[0] || '?'}
                </span>
              </div>
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <span className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  {isUploadingAvatar ? 'Upload en cours...' : 'Changer la photo'}
                </span>
              </label>

              {avatar && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDeleteAvatar}
                  disabled={isUploadingAvatar}
                >
                  Supprimer
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, GIF ou WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="border-t dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations personnelles</h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-400"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="border-t dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Préférences</h3>
        <form onSubmit={handlePreferencesSubmit} className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Langue
            </label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fuseau horaire
            </label>
            <select
              id="timezone"
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
            >
              <option value="Europe/Paris">Paris (UTC+1)</option>
              <option value="America/New_York">New York (UTC-5)</option>
              <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thème
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-card dark:text-gray-100"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Système</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>

      {/* RGPD - Data Export */}
      <div className="border-t dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mes données personnelles (RGPD)</h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Exporter mes données</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Conformément au RGPD, vous pouvez télécharger une copie de toutes vos données personnelles stockées sur notre plateforme.
                Cet export inclut :
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mb-4">
                <li>Vos informations de profil</li>
                <li>Vos paramètres et préférences</li>
                <li>Vos projets et tickets</li>
                <li>Vos factures et devis</li>
                <li>Vos documents</li>
                <li>Votre historique d'activité</li>
              </ul>
              <Button onClick={handleExportData} isLoading={isExporting}>
                {isExporting ? 'Export en cours...' : 'Télécharger mes données (JSON)'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
