# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de lancer le projet en 5 minutes.

## ✅ Statut actuel

- ✅ Infrastructure Docker configurée
- ✅ Base de données PostgreSQL prête
- ✅ Backend Express + Prisma opérationnel
- ✅ Frontend Next.js configuré
- ✅ Schéma Prisma complet avec tous les modèles
- ⏳ Sprint 2 en cours : Développement des features

## 🎯 Démarrage en 3 étapes

### 1. Configuration de l'environnement

Le fichier `.env` existe déjà avec les valeurs par défaut. Pour une utilisation réelle, modifiez :

\`\`\`bash
# Éditez .env et remplacez ces valeurs :
JWT_SECRET=your-super-secret-jwt-key-change-in-production
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
\`\`\`

### 2. Lancer l'application

\`\`\`bash
# Arrêter les services en cours
docker-compose down

# Lancer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
\`\`\`

Vous devriez voir :
- ✅ `saas-ticketing-db` (healthy)
- ✅ `saas-ticketing-backend` (running)
- ✅ `saas-ticketing-frontend` (running)

### 3. Initialiser la base de données

\`\`\`bash
# Créer les tables (migrations)
docker-compose exec backend npm run prisma:migrate

# Peupler avec des données initiales
docker-compose exec backend npm run prisma:seed
\`\`\`

## 🌐 Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur Next.js |
| **Backend API** | http://localhost:4000 | API REST Express |
| **API Health** | http://localhost:4000/health | Endpoint de santé |
| **PostgreSQL** | localhost:5432 | Base de données |
| **Prisma Studio** | - | GUI de gestion BDD |

### Tester les endpoints

\`\`\`bash
# Health check backend
curl http://localhost:4000/health

# API status
curl http://localhost:4000/api
\`\`\`

## 📂 Structure des services

\`\`\`
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│   Next.js       │──────▶│   Express API   │──────▶│   PostgreSQL    │
│   (Port 3000)   │       │   (Port 4000)   │       │   (Port 5432)   │
│                 │       │   + Prisma      │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
       │                           │
       │                           │
       └───────────────┬───────────┘
                       │
                  Stripe API
                  Google OAuth
                  Firebase Auth
\`\`\`

## 🛠 Commandes utiles

### Gestion Docker

\`\`\`bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime la BDD)
docker-compose down -v
\`\`\`

### Prisma

\`\`\`bash
# Ouvrir Prisma Studio (interface graphique de la BDD)
docker-compose exec backend npm run prisma:studio
# Puis ouvrir : http://localhost:5555

# Créer une nouvelle migration après modification du schema
docker-compose exec backend npm run prisma:migrate

# Régénérer le client Prisma
docker-compose exec backend npm run prisma:generate
\`\`\`

### Développement

\`\`\`bash
# Accéder au shell du backend
docker-compose exec backend sh

# Accéder au shell du frontend
docker-compose exec frontend sh

# Rebuild après des changements
docker-compose up --build

# Rebuild un seul service
docker-compose build backend
docker-compose up -d backend
\`\`\`

## 🎨 Modèles de données disponibles

Le schéma Prisma (`backend/prisma/schema.prisma`) contient :

- **User** : Utilisateurs avec rôles
- **Organization** : Organisations multi-utilisateurs
- **Subscription** : Abonnements Stripe
- **Project** : Projets collaboratifs
- **ProjectMember** : Membres des projets
- **Ticket** : Tickets avec statut et priorité
- **TicketAssignee** : Assignation des tickets
- **TimeTrackingSession** : Sessions de time tracking
- **Invoice** : Devis/Factures/Contrats
- **InvoiceItem** : Lignes de facturation
- **Document** : Documents de projet
- **SupportTicket** : Tickets de support
- **SupportComment** : Commentaires de support
- **UserAnalytics** : Analytics utilisateur

## 🔧 Configuration des services externes

### Stripe (Paiements)

1. Créer un compte : https://stripe.com
2. Aller dans Developers → API Keys
3. Copier la clé secrète (sk_test_...)
4. Copier la clé publique (pk_test_...)
5. Configurer les webhooks :
   - URL : `http://localhost:4000/api/stripe/webhook`
   - Events : `customer.subscription.*`, `invoice.*`

### Google OAuth

1. Console Google Cloud : https://console.cloud.google.com
2. Créer un projet
3. Activer Google+ API
4. Créer des identifiants OAuth 2.0
5. Ajouter `http://localhost:4000/api/auth/google/callback` en redirect URI

### Firebase (Auth)

1. Console Firebase : https://console.firebase.google.com
2. Créer un projet
3. Activer Authentication
4. Activer Email/Password et Google
5. Récupérer les clés de configuration

## 📊 Prochaines étapes de développement

### Sprint 2 (En cours)
- [ ] Endpoints CRUD projets complets
- [ ] Endpoints CRUD tickets complets
- [ ] Time tracking start/stop
- [ ] Tests unitaires

### Sprint 3
- [ ] Vue Kanban fonctionnelle
- [ ] Drag & drop tickets
- [ ] Modèles de projets

### Sprint 4-8
Voir `docs/SPRINTS.md` pour le détail complet

## 🐛 Troubleshooting

### Les services ne démarrent pas

\`\`\`bash
# Vérifier Docker Desktop est lancé
docker --version

# Vérifier les ports disponibles
netstat -ano | findstr "3000 4000 5432"

# Nettoyer et redémarrer
docker-compose down -v
docker-compose up --build
\`\`\`

### Erreur de connexion à la base de données

\`\`\`bash
# Vérifier que la DB est healthy
docker-compose ps

# Si non healthy, attendre ou redémarrer
docker-compose restart db
\`\`\`

### Erreur Prisma "schema not found"

\`\`\`bash
# Régénérer le client Prisma
docker-compose exec backend npm run prisma:generate

# Relancer les migrations
docker-compose exec backend npm run prisma:migrate
\`\`\`

### Frontend affiche une erreur

\`\`\`bash
# Vérifier les logs
docker-compose logs frontend

# Vérifier que le backend répond
curl http://localhost:4000/health

# Rebuild le frontend
docker-compose build frontend
docker-compose up -d frontend
\`\`\`

## 📚 Documentation complète

- **Architecture & Features** : `docs/CONTEXT_README.md`
- **Roadmap** : `docs/SPRINTS.md`
- **API Backend** : Voir les controllers dans `backend/src/controllers/`
- **Composants Frontend** : Voir `frontend/components/`

## 🎉 C'est parti !

Votre application est maintenant prête. Vous pouvez :

1. Ouvrir http://localhost:3000 dans votre navigateur
2. Commencer à développer les features du Sprint 2
3. Consulter `docs/SPRINTS.md` pour la roadmap complète

**Happy coding! 🚀**
