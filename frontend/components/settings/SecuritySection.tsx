'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Session {
  id: string;
  device: string | null;
  browser: string | null;
  ipAddress: string | null;
  loginAt: string;
  lastActiveAt: string;
}

export function SecuritySection() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du mot de passe' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ enable: !is2FAEnabled }),
      });

      if (response.ok) {
        setIs2FAEnabled(!is2FAEnabled);
        setMessage({
          type: 'success',
          text: is2FAEnabled ? '2FA désactivé' : '2FA activé avec succès',
        });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Erreur' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification de la 2FA' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter tous les appareils ?')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/sessions`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Toutes les sessions ont été révoquées' });
        setSessions([]);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Erreur' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la révocation des sessions' });
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le mot de passe</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={8}
            />
            <p className="mt-1 text-sm text-gray-500">Minimum 8 caractères</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </div>

      {/* 2FA */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentification à deux facteurs</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium text-gray-900">Double authentification (2FA)</p>
            <p className="text-sm text-gray-600">
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </p>
          </div>
          <Button
            onClick={handleToggle2FA}
            variant={is2FAEnabled ? 'danger' : 'primary'}
            isLoading={isLoading}
          >
            {is2FAEnabled ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sessions actives</h3>
          {sessions.length > 0 && (
            <Button variant="danger" onClick={handleRevokeAllSessions} isLoading={isLoading}>
              Déconnecter tous les appareils
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune session active</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.device || session.browser || 'Appareil inconnu'}
                    </p>
                    <p className="text-sm text-gray-600">IP: {session.ipAddress || 'Inconnue'}</p>
                    <p className="text-sm text-gray-500">
                      Dernière activité: {new Date(session.lastActiveAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
