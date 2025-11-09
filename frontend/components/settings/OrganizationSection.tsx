'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function OrganizationSection() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [orgSettings, setOrgSettings] = useState({
    logo: '',
    primaryColor: '#3B82F6',
    require2FA: false,
    requireStrongPassword: true,
    enableTimeline: true,
    enableAnalytics: false,
    enableDrive: true,
    enableIntegrations: false,
  });

  useEffect(() => {
    fetchOrgSettings();
  }, []);

  const fetchOrgSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/organization`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setOrgSettings({
            logo: data.logo || '',
            primaryColor: data.primaryColor || '#3B82F6',
            require2FA: data.require2FA ?? false,
            requireStrongPassword: data.requireStrongPassword ?? true,
            enableTimeline: data.enableTimeline ?? true,
            enableAnalytics: data.enableAnalytics ?? false,
            enableDrive: data.enableDrive ?? true,
            enableIntegrations: data.enableIntegrations ?? false,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching organization settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/organization`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orgSettings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres de l\'organisation mis à jour' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === 'freelance') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cette section est réservée aux plans Agence et Entreprise.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        {/* Branding */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Identité visuelle</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo de l'organisation (URL)
              </label>
              <input
                type="url"
                id="logo"
                value={orgSettings.logo}
                onChange={(e) => setOrgSettings({ ...orgSettings, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Couleur principale
              </label>
              <input
                type="color"
                id="primaryColor"
                value={orgSettings.primaryColor}
                onChange={(e) => setOrgSettings({ ...orgSettings, primaryColor: e.target.value })}
                className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Politiques de sécurité</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Exiger la 2FA pour tous les membres</p>
                <p className="text-sm text-gray-600">Force l'activation de la double authentification</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={orgSettings.require2FA}
                  onChange={(e) => setOrgSettings({ ...orgSettings, require2FA: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Exiger des mots de passe forts</p>
                <p className="text-sm text-gray-600">Impose des règles strictes pour les mots de passe</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={orgSettings.requireStrongPassword}
                  onChange={(e) => setOrgSettings({ ...orgSettings, requireStrongPassword: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Organization Features */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modules de l'organisation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Timeline</p>
                <p className="text-sm text-gray-600">Planification visuelle de projet</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={orgSettings.enableTimeline}
                  onChange={(e) => setOrgSettings({ ...orgSettings, enableTimeline: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {user?.role === 'enterprise' && (
              <>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">Analytics</p>
                    <p className="text-sm text-gray-600">Statistiques et rapports avancés</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orgSettings.enableAnalytics}
                      onChange={(e) => setOrgSettings({ ...orgSettings, enableAnalytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">Intégrations</p>
                    <p className="text-sm text-gray-600">Connexions externes (Slack, GitHub, etc.)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orgSettings.enableIntegrations}
                      onChange={(e) => setOrgSettings({ ...orgSettings, enableIntegrations: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
