'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { settingsApi, Session } from '@/lib/api/settings';

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
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await settingsApi.getSessions();
      setSessions(data);
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
      await settingsApi.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      // Disable 2FA
      if (!confirm('Êtes-vous sûr de vouloir désactiver la 2FA ?')) {
        return;
      }

      setIsLoading(true);
      setMessage(null);

      try {
        await settingsApi.toggle2FA(false);
        setIs2FAEnabled(false);
        setMessage({ type: 'success', text: '2FA désactivé avec succès' });
      } catch (error: any) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la désactivation de la 2FA' });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enable 2FA - show setup
      setIsLoading(true);
      setMessage(null);

      try {
        const data = await settingsApi.toggle2FA(true);
        setQrCode(data.qrCode);
        setBackupCodes(data.backupCodes || []);
        setShow2FASetup(true);
        setMessage({ type: 'success', text: data.message });
      } catch (error: any) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de l\'activation de la 2FA' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode) {
      setMessage({ type: 'error', text: 'Veuillez entrer le code de vérification' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await settingsApi.verify2FA(verificationCode);
      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setVerificationCode('');
      setMessage({ type: 'success', text: '2FA activé avec succès !' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la vérification' });
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
      await settingsApi.revokeAllSessions();
      setMessage({ type: 'success', text: 'Toutes les sessions ont été révoquées' });
      setSessions([]);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la révocation des sessions' });
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

        {!show2FASetup ? (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-900">Double authentification (2FA)</p>
              <p className="text-sm text-gray-600">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
              {is2FAEnabled && (
                <p className="text-sm text-green-600 mt-1 font-medium">✓ Activé</p>
              )}
            </div>
            <Button
              onClick={handleToggle2FA}
              variant={is2FAEnabled ? 'danger' : 'primary'}
              isLoading={isLoading}
            >
              {is2FAEnabled ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Configuration de la 2FA</h4>

            {/* Step 1: QR Code */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-4">
                <strong>Étape 1 :</strong> Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
              </p>
              {qrCode && (
                <div className="flex justify-center bg-white p-4 rounded-lg border border-gray-200">
                  <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              )}
            </div>

            {/* Step 2: Backup Codes */}
            {backupCodes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Étape 2 :</strong> Sauvegardez ces codes de récupération dans un endroit sûr. Vous pourrez les utiliser si vous perdez l'accès à votre application d'authentification.
                </p>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code key={index} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Verify */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Étape 3 :</strong> Entrez le code à 6 chiffres généré par votre application pour vérifier
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button onClick={handleVerify2FA} isLoading={isLoading}>
                  Vérifier
                </Button>
              </div>
            </div>

            <button
              onClick={() => {
                setShow2FASetup(false);
                setQrCode('');
                setBackupCodes([]);
                setVerificationCode('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Annuler
            </button>
          </div>
        )}
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
