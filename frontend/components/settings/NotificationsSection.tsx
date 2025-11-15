'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { settingsApi } from '@/lib/api/settings';

interface NotificationSettings {
  notificationsEmail: boolean;
  notificationsInApp: boolean;
  notificationsPush: boolean;
  notifyOnTicketAssignment: boolean;
  notifyOnComment: boolean;
  notifyOnStatusChange: boolean;
  notifyOnInvoice: boolean;
  notifyOnPaymentFailed: boolean;
  weeklyDigest: boolean;
}

export function NotificationsSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<NotificationSettings>({
    notificationsEmail: true,
    notificationsInApp: true,
    notificationsPush: false,
    notifyOnTicketAssignment: true,
    notifyOnComment: true,
    notifyOnStatusChange: true,
    notifyOnInvoice: true,
    notifyOnPaymentFailed: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    // Only fetch when component mounts
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsApi.getUserSettings();
      setSettings({
        notificationsEmail: data.notificationsEmail ?? true,
        notificationsInApp: data.notificationsInApp ?? true,
        notificationsPush: data.notificationsPush ?? false,
        notifyOnTicketAssignment: data.notifyOnTicketAssignment ?? true,
        notifyOnComment: data.notifyOnComment ?? true,
        notifyOnStatusChange: data.notifyOnStatusChange ?? true,
        notifyOnInvoice: data.notifyOnInvoice ?? true,
        notifyOnPaymentFailed: data.notifyOnPaymentFailed ?? true,
        weeklyDigest: data.weeklyDigest ?? false,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await settingsApi.updateNotifications(settings);
      setMessage({ type: 'success', text: 'Préférences de notification mises à jour avec succès' });
      // Reload settings to ensure they are up to date
      await fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour des notifications' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Channel Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Canaux de notification</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-600">Recevez des notifications par email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEmail}
                  onChange={() => toggleSetting('notificationsEmail')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Notifications in-app</p>
                <p className="text-sm text-gray-600">Recevez des notifications dans l'application</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsInApp}
                  onChange={() => toggleSetting('notificationsInApp')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Notifications push</p>
                <p className="text-sm text-gray-600">Recevez des notifications push sur vos appareils</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsPush}
                  onChange={() => toggleSetting('notificationsPush')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Event Preferences */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences d'événements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Assignation de ticket</p>
                <p className="text-sm text-gray-600">Recevoir une notification quand un ticket vous est assigné</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnTicketAssignment}
                  onChange={() => toggleSetting('notifyOnTicketAssignment')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Commentaires et mentions</p>
                <p className="text-sm text-gray-600">Recevoir une notification pour les commentaires et mentions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnComment}
                  onChange={() => toggleSetting('notifyOnComment')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Changement de statut</p>
                <p className="text-sm text-gray-600">Recevoir une notification lors du changement de statut d'un projet</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnStatusChange}
                  onChange={() => toggleSetting('notifyOnStatusChange')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Factures et devis</p>
                <p className="text-sm text-gray-600">Recevoir une notification pour les nouvelles factures/devis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnInvoice}
                  onChange={() => toggleSetting('notifyOnInvoice')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Échec de paiement</p>
                <p className="text-sm text-gray-600">Recevoir une notification en cas d'échec de paiement</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyOnPaymentFailed}
                  onChange={() => toggleSetting('notifyOnPaymentFailed')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Digest */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé hebdomadaire</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-900">Résumé hebdomadaire par email</p>
              <p className="text-sm text-gray-600">Recevez un résumé de votre activité chaque semaine</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={() => toggleSetting('weeklyDigest')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
