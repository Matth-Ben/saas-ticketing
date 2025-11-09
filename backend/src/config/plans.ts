export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // en centimes
  priceYearly: number; // en centimes
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export const PLANS: Record<string, Plan> = {
  freelance: {
    id: 'freelance',
    name: 'Freelance',
    description: 'Parfait pour les indépendants',
    priceMonthly: 2900, // 29€/mois
    priceYearly: 29000, // 290€/an (économie de 2 mois)
    features: [
      '5 projets maximum',
      'Tickets illimités',
      'Devis & Factures',
      'Time Tracking',
      'Lien Client',
      'Support email',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'Pour les petites équipes',
    priceMonthly: 7900, // 79€/mois
    priceYearly: 79000, // 790€/an (économie de 2 mois)
    features: [
      '20 projets maximum',
      'Tickets illimités',
      'Devis & Factures',
      'Time Tracking',
      'Timeline',
      'Lien Client',
      'Stockage Drive (10 GB)',
      'Utilisateurs multiples (5 max)',
      'Support prioritaire',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Pour les grandes organisations',
    priceMonthly: 19900, // 199€/mois
    priceYearly: 199000, // 1990€/an (économie de 2 mois)
    features: [
      'Projets illimités',
      'Tickets illimités',
      'Devis & Factures',
      'Time Tracking',
      'Timeline',
      'Lien Client',
      'Stockage Drive (100 GB)',
      'Analytics avancés',
      'Intégrations',
      'Utilisateurs illimités',
      'Support dédié 24/7',
      'Marque blanche',
    ],
  },
};
