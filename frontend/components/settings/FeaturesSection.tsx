'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { settingsApi } from '@/lib/api/settings';

interface FeatureSettings {
  enableQuotes: boolean;
  enableTimeline: boolean;
  enableDrive: boolean;
  enableClientLink: boolean;
  enableAnalytics: boolean;
  enableTimeTracking: boolean;
}

interface Feature {
  key: keyof FeatureSettings;
  name: string;
  description: string;
  availableFor: string[];
  isPremium?: boolean;
}

const features: Feature[] = [
  {
    key: 'enableQuotes',
    name: 'Devis & Factures',
    description: 'Créez et gérez vos documents financiers',
    availableFor: ['freelance', 'agency', 'enterprise'],
  },
  {
    key: 'enableTimeTracking',
    name: 'Time Tracking',
    description: 'Suivi du temps sur vos tickets',
    availableFor: ['freelance', 'agency', 'enterprise'],
  },
  {
    key: 'enableTimeline',
    name: 'Timeline',
    description: 'Planification visuelle de projet',
    availableFor: ['agency', 'enterprise'],
    isPremium: true,
  },
  {
    key: 'enableClientLink',
    name: 'Lien Client',
    description: 'Accès client sécurisé aux projets',
    availableFor: ['freelance', 'agency', 'enterprise'],
  },
  {
    key: 'enableAnalytics',
    name: 'Analytics',
    description: 'Statistiques et rapports avancés',
    availableFor: ['enterprise'],
    isPremium: true,
  },
  {
    key: 'enableDrive',
    name: 'Drive',
    description: 'Stockage et partage de documents',
    availableFor: ['freelance', 'agency', 'enterprise'],
  },
];

export function FeaturesSection() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<FeatureSettings>({
    enableQuotes: true,
    enableTimeline: false,
    enableDrive: true,
    enableClientLink: true,
    enableAnalytics: false,
    enableTimeTracking: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsApi.getUserSettings();
      setSettings({
        enableQuotes: data.enableQuotes ?? true,
        enableTimeline: data.enableTimeline ?? false,
        enableDrive: data.enableDrive ?? true,
        enableClientLink: data.enableClientLink ?? true,
        enableAnalytics: data.enableAnalytics ?? false,
        enableTimeTracking: data.enableTimeTracking ?? true,
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
      await settingsApi.updateFeatures(settings);
      setMessage({ type: 'success', text: 'Modules mis à jour avec succès' });
      // Reload settings to ensure they are up to date
      await fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour des modules' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeature = (key: keyof FeatureSettings, isAvailable: boolean) => {
    if (!isAvailable) return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isFeatureAvailable = (feature: Feature): boolean => {
    return feature.availableFor.includes(user?.role || '');
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

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Modules activables</h3>
        <p className="text-sm text-gray-600">
          Activez ou désactivez les modules selon vos besoins. Certains modules sont restreints selon votre plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const isAvailable = isFeatureAvailable(feature);
            const isEnabled = settings[feature.key];

            return (
              <div
                key={feature.key}
                className={`
                  p-6 border-2 rounded-lg transition-all
                  ${isAvailable
                    ? isEnabled
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                      {feature.isPremium && (
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>

                  <label
                    className={`relative inline-flex items-center ${
                      isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleFeature(feature.key, isAvailable)}
                      disabled={!isAvailable}
                      className="sr-only peer"
                    />
                    <div
                      className={`
                        w-11 h-6 rounded-full peer
                        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full
                        after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white
                        ${isAvailable
                          ? 'bg-gray-200 peer-checked:bg-blue-600'
                          : 'bg-gray-300 cursor-not-allowed'
                        }
                      `}
                    ></div>
                  </label>
                </div>

                {!isAvailable && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Disponible pour: {feature.availableFor.map(role => {
                        const roleNames: Record<string, string> = {
                          freelance: 'Freelance',
                          agency: 'Agence',
                          enterprise: 'Entreprise',
                        };
                        return roleNames[role];
                      }).join(', ')}
                    </p>
                  </div>
                )}

                {isAvailable && isEnabled && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">Module activé</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isSaving}>
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
