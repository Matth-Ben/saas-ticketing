export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // en €
  priceYearly: number; // en €
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  freelance: {
    id: 'freelance',
    name: 'Freelance',
    description: 'Parfait pour les indépendants',
    priceMonthly: 29,
    priceYearly: 290, // économie de 2 mois
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
    priceMonthly: 79,
    priceYearly: 790,
    popular: true,
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
    priceMonthly: 199,
    priceYearly: 1990,
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
