'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { FeaturesSection } from '@/components/settings/FeaturesSection';
import { BillingSection } from '@/components/settings/BillingSection';
import { OrganizationSection } from '@/components/settings/OrganizationSection';
import { IntegrationsSection } from '@/components/settings/IntegrationsSection';

type Tab = 'profile' | 'security' | 'notifications' | 'features' | 'billing' | 'organization' | 'integrations';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; roles?: string[] }[] = [
    { id: 'profile', label: 'Profil' },
    { id: 'security', label: 'Sécurité' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'features', label: 'Modules' },
    { id: 'billing', label: 'Facturation' },
    { id: 'organization', label: 'Organisation', roles: ['agency', 'enterprise'] },
    { id: 'integrations', label: 'Intégrations', roles: ['enterprise'] },
  ];

  // Filter tabs based on user role
  const visibleTabs = tabs.filter(tab =>
    !tab.roles || tab.roles.includes(user?.role || '')
  );

  const renderSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'features':
        return <FeaturesSection />;
      case 'billing':
        return <BillingSection />;
      case 'organization':
        return <OrganizationSection />;
      case 'integrations':
        return <IntegrationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap px-6 py-4 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
