# 🎫 SaaS Ticketing - Plateforme de Gestion de Projets

Plateforme SaaS complète pour la gestion de projets, tickets, devis, factures avec time tracking et gestion d'abonnements via Stripe.

## 📋 Table des matières

- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [Variables d'environnement](#-variables-denvironnement)
- [Scripts disponibles](#-scripts-disponibles)
- [Documentation](#-documentation)

## 🛠️ Stack technique

- **Frontend :** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend :** Node.js + Express + TypeScript + Prisma
- **Base de données :** PostgreSQL
- **Authentification :** JWT + Google OAuth
- **Paiement :** Stripe (abonnements mensuel/annuel + essai 15 jours)
- **Conteneurisation :** Docker + Docker Compose

## 🏗️ Architecture

```
saas-ticketing/
├── backend/          # API Express + Prisma
├── frontend/         # Next.js App Router
├── docs/             # Documentation
├── scripts/          # Scripts de setup et maintenance
├── config/           # Fichiers de configuration
├── docker-compose.yml
├── .env.example
└── README.md
```

## 📦 Prérequis

- Docker & Docker Compose
- Node.js 18+ (pour développement local)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd saas-ticketing
```

### 2. Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Éditez `.env` et configurez :
- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Secret pour les tokens JWT
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` : Pour OAuth Google
- Et autres variables nécessaires

### 3. Script de setup automatique

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Ou manuellement :

```bash
# Installer les dépendances backend
cd backend
npm install
npx prisma generate
cd ..

# Installer les dépendances frontend
cd frontend
npm install
cd ..
```

## 🏃 Démarrage

### Démarrage avec Docker Compose (recommandé)

```bash
# Lancer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d
```

Les services seront disponibles sur :
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:4000
- **PostgreSQL :** localhost:5432

### Initialisation de la base de données

Une fois les services lancés :

```bash
# Exécuter les migrations
docker-compose exec backend npm run prisma:migrate

# Seed la base de données (création d'utilisateurs test)
docker-compose exec backend npm run prisma:seed
```

### Démarrage en développement local (sans Docker)

#### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Structure du projet

### Backend (`backend/`)

```
backend/
├── src/
│   ├── controllers/     # Contrôleurs API
│   ├── services/        # Logique métier
│   ├── routes/          # Routes Express
│   ├── middleware/      # Middlewares (auth, validation, etc.)
│   ├── validators/      # Validateurs de requêtes
│   ├── utils/           # Utilitaires (logger, JWT, Prisma)
│   ├── prisma/          # Scripts Prisma (seed)
│   └── server.ts        # Point d'entrée
├── prisma/
│   └── schema.prisma    # Schéma Prisma
├── Dockerfile
└── package.json
```

### Frontend (`frontend/`)

```
frontend/
├── app/                 # Next.js App Router
│   ├── auth/           # Pages d'authentification
│   ├── dashboard/      # Tableau de bord
│   ├── projects/       # Pages projets
│   ├── billing/        # Gestion abonnements
│   └── admin/          # Administration
├── components/         # Composants React
│   ├── ui/            # Composants UI de base
│   ├── projects/      # Composants projets
│   ├── kanban/        # Composants Kanban
│   ├── stripe/        # Composants Stripe
│   └── admin/         # Composants admin
├── lib/                # Bibliothèques et utilitaires
│   ├── api/           # Clients API
│   └── validations/   # Schémas de validation
├── hooks/              # React hooks personnalisés
├── context/            # Contextes React
└── public/             # Fichiers statiques
```

## 🔐 Variables d'environnement

### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://saas_user:saas_password@db:5432/saas_ticketing

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Server
PORT=4000
NODE_ENV=development
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📜 Scripts disponibles

### Scripts globaux

- `./scripts/setup.sh` : Setup initial du projet
- `./scripts/migrate.sh` : Exécuter les migrations Prisma
- `./scripts/seed.sh` : Seed la base de données
- `./scripts/reset-db.sh` : Réinitialiser la base de données
- `./scripts/create-user.sh` : Créer un utilisateur test

### Scripts backend

```bash
cd backend
npm run dev              # Démarrage en développement
npm run build            # Build production
npm run start            # Démarrage production
npm run prisma:migrate   # Exécuter migrations
npm run prisma:seed     # Seed la base
npm run prisma:studio   # Ouvrir Prisma Studio
npm run lint            # Linter
npm run format          # Formatter le code
```

### Scripts frontend

```bash
cd frontend
npm run dev              # Démarrage en développement
npm run build            # Build production
npm run start            # Démarrage production
npm run lint             # Linter
npm run format          # Formatter le code
npm run type-check      # Vérification TypeScript
```

## 📚 Documentation

- [CONTEXT_README.md](./CONTEXT_README.md) : Contexte fonctionnel complet
- [SPRINTS.md](./SPRINTS.md) : Planification des sprints de développement
- [docs/](./docs/) : Documentation supplémentaire

## 🔧 Développement

### Workflow recommandé

1. **Sprint 1** : Authentification (JWT, Google OAuth)
2. **Sprint 2** : Gestion projets & tickets (CRUD)
3. **Sprint 3** : Kanban & modèles de projets
4. **Sprint 4** : Devis / Factures / Contrats
5. **Sprint 5** : Lien client & documents
6. **Sprint 6** : Abonnements & Paiement (Stripe)
7. **Sprint 7** : Administration / Back-office
8. **Sprint 8** : Optimisations & fonctionnalités avancées

### Accès aux outils de développement

- **Prisma Studio** : `docker-compose exec backend npm run prisma:studio`
- **Logs backend** : `docker-compose logs -f backend`
- **Logs frontend** : `docker-compose logs -f frontend`
- **Logs database** : `docker-compose logs -f db`

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Notes importantes

- Tous les fichiers contiennent des **TODO** pour guider l'implémentation
- Le schéma Prisma est complet et prêt à être utilisé
- Les routes API sont structurées mais nécessitent l'implémentation de la logique métier
- Les composants frontend sont des placeholders avec structure de base

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Implémenter les fonctionnalités selon les TODOs
3. Tester localement
4. Créer une pull request

## 📄 Licence

[À définir]

---

**🚀 Prêt à démarrer !** Suivez les instructions ci-dessus pour lancer le projet.

