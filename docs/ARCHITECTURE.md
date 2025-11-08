# 🏗️ Architecture du Projet

## Vue d'ensemble

Ce document décrit l'architecture technique du SaaS Ticketing Platform.

## Stack technique

### Frontend
- **Framework** : Next.js 14 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **State Management** : Zustand + React Context
- **Form Handling** : React Hook Form + Zod
- **HTTP Client** : Axios
- **Drag & Drop** : react-beautiful-dnd
- **Stripe** : @stripe/react-stripe-js

### Backend
- **Framework** : Express.js
- **Language** : TypeScript
- **ORM** : Prisma
- **Database** : PostgreSQL
- **Authentication** : JWT + Passport.js (Google OAuth)
- **Payment** : Stripe
- **Validation** : express-validator
- **Logging** : Winston

### Infrastructure
- **Containerization** : Docker + Docker Compose
- **Database** : PostgreSQL 15
- **Reverse Proxy** : (Optionnel) Nginx pour production

## Architecture des dossiers

### Backend (`backend/`)

```
backend/
├── src/
│   ├── controllers/        # Contrôleurs API (logique HTTP)
│   │   ├── authController.ts
│   │   ├── projectController.ts
│   │   ├── ticketController.ts
│   │   ├── invoiceController.ts
│   │   ├── stripeController.ts
│   │   ├── supportController.ts
│   │   ├── analyticsController.ts
│   │   └── adminController.ts
│   ├── services/           # Logique métier
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── ticketService.ts
│   │   ├── invoiceService.ts
│   │   ├── stripeService.ts
│   │   ├── supportService.ts
│   │   ├── adminService.ts
│   │   └── analyticsService.ts
│   ├── routes/             # Routes Express
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── tickets.ts
│   │   ├── invoices.ts
│   │   ├── stripe.ts
│   │   ├── support.ts
│   │   ├── analytics.ts
│   │   └── admin.ts
│   ├── middleware/         # Middlewares
│   │   ├── auth.ts         # Authentification JWT
│   │   ├── errorHandler.ts # Gestion d'erreurs
│   │   ├── validate.ts     # Validation des requêtes
│   │   └── stripeWebhook.ts # Vérification webhooks Stripe
│   ├── validators/         # Validateurs express-validator
│   │   ├── authValidator.ts
│   │   ├── projectValidator.ts
│   │   ├── ticketValidator.ts
│   │   ├── invoiceValidator.ts
│   │   └── supportValidator.ts
│   ├── utils/             # Utilitaires
│   │   ├── prisma.ts      # Client Prisma
│   │   ├── jwt.ts         # Utilitaires JWT
│   │   └── logger.ts      # Logger Winston
│   ├── prisma/            # Scripts Prisma
│   │   └── seed.ts        # Seed de la base de données
│   └── server.ts          # Point d'entrée Express
├── prisma/
│   └── schema.prisma      # Schéma Prisma
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Frontend (`frontend/`)

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux
│   ├── auth/              # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Tableau de bord
│   ├── projects/          # Pages projets
│   │   └── [id]/          # Page projet individuel
│   ├── billing/           # Gestion abonnements
│   └── admin/             # Administration
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── projects/         # Composants projets
│   │   └── ProjectCard.tsx
│   ├── kanban/           # Composants Kanban
│   │   └── KanbanBoard.tsx
│   ├── stripe/           # Composants Stripe
│   │   └── StripeCheckout.tsx
│   └── admin/            # Composants admin
│       └── AdminDashboard.tsx
├── lib/                   # Bibliothèques et utilitaires
│   ├── api/              # Clients API
│   │   ├── client.ts     # Client Axios configuré
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── tickets.ts
│   │   ├── invoices.ts
│   │   └── stripe.ts
│   └── validations/      # Schémas Zod
│       └── auth.ts
├── hooks/                 # React hooks personnalisés
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useProject.ts
│   ├── useSubscription.ts
│   └── useAdmin.ts
├── context/               # Contextes React
│   └── AuthContext.tsx
├── public/                # Fichiers statiques
├── Dockerfile
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Flux de données

### Authentification

1. Utilisateur se connecte via `/api/auth/login`
2. Backend vérifie les credentials
3. Backend génère JWT access token + refresh token
4. Frontend stocke les tokens (localStorage)
5. Frontend inclut le token dans les requêtes suivantes
6. Backend vérifie le token via middleware `authenticate`

### Gestion des projets

1. Frontend appelle `GET /api/projects`
2. Middleware `authenticate` vérifie le token
3. Controller `getProjects` récupère les projets
4. Service `projectService` interroge Prisma
5. Réponse JSON retournée au frontend
6. Frontend met à jour l'état avec les données

### Stripe Checkout

1. Utilisateur sélectionne un plan
2. Frontend appelle `POST /api/stripe/checkout`
3. Backend crée une session Stripe Checkout
4. Frontend redirige vers Stripe
5. Après paiement, Stripe envoie un webhook
6. Backend traite le webhook et met à jour l'abonnement

## Base de données

### Modèles principaux

- **User** : Utilisateurs (freelance, agency, enterprise, admin)
- **Organization** : Organisations
- **Subscription** : Abonnements Stripe
- **Project** : Projets
- **Ticket** : Tickets de projet
- **Invoice** : Devis, factures, contrats
- **Document** : Documents associés aux projets
- **SupportTicket** : Tickets de support
- **UserAnalytics** : Analytics utilisateur

Voir `backend/prisma/schema.prisma` pour le schéma complet.

## Sécurité

### Authentification
- JWT avec expiration courte (15 min)
- Refresh tokens avec expiration longue (7 jours)
- Google OAuth pour connexion sociale

### Autorisation
- Middleware `authorize` pour vérifier les rôles
- Vérification des permissions au niveau service
- Accès aux projets basé sur l'organisation

### Validation
- Validation des entrées côté backend (express-validator)
- Validation côté frontend (Zod)
- Sanitization des données

### Stripe
- Webhooks vérifiés via signature Stripe
- Secrets stockés en variables d'environnement

## Déploiement

### Développement
- Docker Compose pour orchestrer les services
- Hot reload pour backend et frontend
- Prisma Studio pour gestion de la base de données

### Production
- Build optimisé des images Docker
- Variables d'environnement sécurisées
- Base de données persistante via volumes
- Reverse proxy (Nginx) recommandé

## Performance

### Backend
- Pool de connexions Prisma
- Index sur les colonnes fréquemment interrogées
- Pagination pour les listes

### Frontend
- Code splitting automatique (Next.js)
- Images optimisées
- Lazy loading des composants
- Cache des requêtes API

## Monitoring

### Logs
- Winston pour logging backend
- Logs structurés en JSON
- Niveaux de log configurables

### Analytics
- Suivi des actions utilisateur
- Métriques de performance
- Dashboard admin avec statistiques

