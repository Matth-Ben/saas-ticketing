'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(planId);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, billingPeriod }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création de la session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erreur lors de la création de la session');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Essai gratuit de 15 jours. Aucune carte bancaire requise.
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('month')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('year')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === 'year'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                  Populaire
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">
                    {billingPeriod === 'month' ? plan.priceMonthly : Math.floor(plan.priceYearly / 12)}€
                  </span>
                  <span className="text-gray-600 ml-2">/mois</span>
                  {billingPeriod === 'year' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Facturé {plan.priceYearly}€/an
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  isLoading={isLoading === plan.id}
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'secondary'}
                >
                  Commencer l'essai gratuit
                </Button>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trial Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Tous les plans incluent 15 jours d'essai gratuit. Aucune carte bancaire requise.
            <br />
            Vous pouvez annuler à tout moment depuis votre espace paramètres.
          </p>
        </div>
      </div>
    </div>
  );
}
