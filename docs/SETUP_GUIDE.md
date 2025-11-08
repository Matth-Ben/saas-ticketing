# 📖 Guide de Setup Complet

Ce guide vous accompagne étape par étape pour démarrer le projet SaaS Ticketing.

## ✅ Checklist de démarrage

- [ ] Docker et Docker Compose installés
- [ ] Variables d'environnement configurées
- [ ] Services Docker lancés
- [ ] Base de données migrée
- [ ] Base de données seedée
- [ ] Frontend et Backend accessibles

## 🚀 Démarrage rapide

### 1. Configuration initiale

```bash
# Cloner le projet (si nécessaire)
git clone <repository-url>
cd saas-ticketing

# Copier les fichiers .env.example vers .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Éditer les fichiers .env et configurer :
# - DATABASE_URL
# - JWT_SECRET et JWT_REFRESH_SECRET
# - STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET
# - GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### 2. Lancer les services

```bash
# Lancer tous les services avec Docker Compose
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d
```

### 3. Initialiser la base de données

Dans un nouveau terminal :

```bash
# Exécuter les migrations Prisma
docker-compose exec backend npm run prisma:migrate

# Seed la base de données (création d'utilisateurs test)
docker-compose exec backend npm run prisma:seed
```

### 4. Accéder aux services

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:4000
- **API Health Check** : http://localhost:4000/health
- **Prisma Studio** : `docker-compose exec backend npm run prisma:studio`

## 🔧 Configuration détaillée

### Variables d'environnement Backend

Éditez `backend/.env` :

```env
# Database - Utilisez les valeurs par défaut pour Docker Compose
DATABASE_URL=postgresql://saas_user:saas_password@db:5432/saas_ticketing

# JWT - Générez des secrets forts en production
JWT_SECRET=change-this-to-a-random-secret-key
JWT_REFRESH_SECRET=change-this-to-a-random-refresh-secret-key

# Stripe - Obtenez vos clés sur https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth - Créez un projet sur https://console.cloud.google.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# CORS - URL du frontend
CORS_ORIGIN=http://localhost:3000
```

### Variables d'environnement Frontend

Éditez `frontend/.env.local` :

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# URL de l'application frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clé publique Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🧪 Utilisateurs de test

Après le seed, les utilisateurs suivants sont créés :

- **Admin** :
  - Email : `admin@saas-ticketing.com`
  - Password : `admin123`
  - Rôle : `admin`

- **Freelance** :
  - Email : `freelance@test.com`
  - Password : `test123`
  - Rôle : `freelance`

## 📝 Commandes utiles

### Docker Compose

```bash
# Lancer les services
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Redémarrer un service
docker-compose restart backend
```

### Prisma

```bash
# Migrations
docker-compose exec backend npm run prisma:migrate

# Seed
docker-compose exec backend npm run prisma:seed

# Prisma Studio (interface graphique)
docker-compose exec backend npm run prisma:studio

# Générer le client Prisma
docker-compose exec backend npm run prisma:generate
```

### Scripts

```bash
# Setup initial
chmod +x scripts/*.sh
./scripts/setup.sh

# Migrations
./scripts/migrate.sh

# Seed
./scripts/seed.sh

# Réinitialiser la base de données
./scripts/reset-db.sh
```

## 🐛 Dépannage

### Le backend ne démarre pas

1. Vérifiez que la base de données est prête :
   ```bash
   docker-compose logs db
   ```

2. Vérifiez les variables d'environnement :
   ```bash
   docker-compose exec backend env | grep DATABASE_URL
   ```

3. Vérifiez les logs :
   ```bash
   docker-compose logs backend
   ```

### Le frontend ne se connecte pas au backend

1. Vérifiez que `NEXT_PUBLIC_API_URL` est correct dans `frontend/.env.local`
2. Vérifiez que le backend est accessible : http://localhost:4000/health
3. Vérifiez les logs du frontend :
   ```bash
   docker-compose logs frontend
   ```

### Erreurs de migration Prisma

1. Vérifiez que la base de données est accessible
2. Vérifiez la variable `DATABASE_URL`
3. Réinitialisez la base de données si nécessaire :
   ```bash
   ./scripts/reset-db.sh
   ```

### Problèmes de permissions

Sur Linux/Mac, vous pourriez avoir besoin de :

```bash
chmod +x scripts/*.sh
```

## 📚 Prochaines étapes

Une fois le projet lancé :

1. **Sprint 1** : Implémenter l'authentification
   - Compléter `authController.ts`
   - Compléter `authService.ts`
   - Créer les pages de login/register

2. **Sprint 2** : Implémenter la gestion des projets
   - Compléter `projectController.ts`
   - Compléter `projectService.ts`
   - Créer les pages projets

3. Continuer selon le plan dans `SPRINTS.md`

## 🔗 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Docker Compose](https://docs.docker.com/compose/)

## 💡 Astuces

- Utilisez Prisma Studio pour visualiser et modifier la base de données
- Les logs Docker sont très utiles pour le débogage
- Tous les fichiers contiennent des TODO pour guider l'implémentation
- Le schéma Prisma est complet et prêt à être utilisé

---

**Besoin d'aide ?** Consultez les fichiers `CONTEXT_README.md` et `SPRINTS.md` pour plus de détails sur les fonctionnalités et le plan de développement.

