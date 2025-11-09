'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function IntegrationsSection() {
  const { user } = useAuth();

  if (user?.role !== 'enterprise') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cette section est réservée au plan Entreprise.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Intégrations disponibles</h3>
        <p className="text-gray-600 mb-6">
          Connectez vos outils préférés à votre plateforme de ticketing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slack Integration */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Slack</h4>
                <p className="text-sm text-gray-500">Non connecté</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Recevez des notifications et gérez vos tickets directement depuis Slack.
            </p>
            <Button variant="secondary">Connecter Slack</Button>
          </div>

          {/* GitHub Integration */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🐙</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">GitHub</h4>
                <p className="text-sm text-gray-500">Non connecté</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Liez vos tickets aux issues et pull requests GitHub.
            </p>
            <Button variant="secondary">Connecter GitHub</Button>
          </div>

          {/* Notion Integration */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Notion</h4>
                <p className="text-sm text-gray-500">Non connecté</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Synchronisez vos projets et documentation avec Notion.
            </p>
            <Button variant="secondary">Connecter Notion</Button>
          </div>

          {/* Webhooks */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Webhooks</h4>
                <p className="text-sm text-gray-500">0 webhook actif</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Créez des webhooks personnalisés pour automatiser vos workflows.
            </p>
            <Button variant="secondary">Configurer</Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Access</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-4">
            Utilisez l'API REST pour intégrer votre plateforme avec vos propres outils.
          </p>
          <Button variant="secondary">Générer une clé API</Button>
        </div>
      </div>
    </div>
  );
}
