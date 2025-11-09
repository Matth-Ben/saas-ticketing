'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function BillingSection() {
  const router = useRouter();

  const openStripePortal = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening Stripe portal:', error);
    }
  };

  const goToPricing = () => {
    router.push('/pricing');
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan actuel</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">Essai gratuit</h4>
              <p className="text-sm text-gray-600 mt-1">
                Profitez de toutes les fonctionnalités pendant 15 jours
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Aucun paiement requis pendant la période d'essai
              </p>
            </div>
            <Button onClick={goToPricing} variant="primary">
              Choisir un plan
            </Button>
          </div>
        </div>
      </div>

      {/* Stripe Portal */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturation et abonnement</h3>
        <p className="text-gray-600 mb-6">
          Gérez votre abonnement, vos moyens de paiement et consultez votre historique de facturation.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Portail de facturation Stripe</h4>
          <p className="text-sm text-gray-600 mb-4">
            Accédez à votre portail de facturation sécurisé pour :
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-6">
            <li>Voir votre plan actuel et vos informations de facturation</li>
            <li>Mettre à jour votre moyen de paiement</li>
            <li>Télécharger vos factures</li>
            <li>Modifier ou annuler votre abonnement</li>
            <li>Consulter l'historique de vos paiements</li>
          </ul>

          <Button onClick={openStripePortal}>
            Ouvrir le portail de facturation
          </Button>
        </div>
      </div>

      {/* Billing Preferences */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de facturation</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="billingMode" className="block text-sm font-medium text-gray-700 mb-1">
              Mode d'affichage des prix
            </label>
            <select
              id="billingMode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="HT"
            >
              <option value="HT">Hors Taxes (HT)</option>
              <option value="TTC">Toutes Taxes Comprises (TTC)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
