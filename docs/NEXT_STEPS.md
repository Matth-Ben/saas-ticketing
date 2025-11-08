# 🎯 Prochaines Étapes - SaaS Ticketing

## ✅ État actuel

Votre projet est **100% opérationnel** :
- ✅ Infrastructure Docker complète
- ✅ Backend Express avec Prisma
- ✅ Frontend Next.js configuré
- ✅ Schéma de base de données complet
- ✅ Structure de code professionnelle

## 🚀 Démarrage immédiat

### 1. Lancer l'application

\`\`\`bash
# Démarrer tous les services
docker-compose up -d

# Ou utiliser le script helper
scripts\dev.bat start        # Windows
./scripts/dev.sh start       # Linux/Mac
\`\`\`

### 2. Initialiser la base de données

\`\`\`bash
# Exécuter les migrations Prisma
docker-compose exec backend npm run prisma:migrate

# Peupler avec des données de test
docker-compose exec backend npm run prisma:seed

# Ou utiliser le script helper
scripts\dev.bat init         # Windows
./scripts/dev.sh init        # Linux/Mac
\`\`\`

### 3. Vérifier que tout fonctionne

\`\`\`bash
# Tester le backend
curl http://localhost:4000/health

# Ouvrir le frontend
# Navigateur : http://localhost:3000

# Voir les logs
docker-compose logs -f
\`\`\`

## 📋 Sprint 2 - Tâches à accomplir

### Phase 1 : Authentification (Priorité 🔴)

1. **Implémenter authService.ts**
   - [ ] Fonction `register(email, password)`
   - [ ] Fonction `login(email, password)`
   - [ ] Génération JWT tokens
   - [ ] Validation email
   - [ ] Hash des mots de passe avec bcrypt

2. **Implémenter authController.ts**
   - [ ] Endpoint `POST /api/auth/register`
   - [ ] Endpoint `POST /api/auth/login`
   - [ ] Endpoint `POST /api/auth/refresh`
   - [ ] Gestion des erreurs (email existant, mauvais mot de passe)

3. **Implémenter middleware/auth.ts**
   - [ ] Fonction `verifyToken(req, res, next)`
   - [ ] Fonction `requireRole(roles)`
   - [ ] Extraction du user depuis le JWT
   - [ ] Gestion des tokens expirés

4. **Tests**
   - [ ] Test inscription utilisateur
   - [ ] Test connexion
   - [ ] Test refresh token
   - [ ] Test middleware auth

**Fichiers à modifier :**
- `backend/src/services/authService.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/middleware/auth.ts`
- `backend/src/utils/jwt.ts`

---

### Phase 2 : Projets (Priorité 🔴)

1. **Implémenter projectService.ts**
   - [ ] `createProject(data, userId)`
   - [ ] `getProjects(userId)` - Filtrer par utilisateur
   - [ ] `getProjectById(id, userId)` - Vérifier permissions
   - [ ] `updateProject(id, data, userId)`
   - [ ] `deleteProject(id, userId)`
   - [ ] `addMember(projectId, userId, role)`
   - [ ] `removeMember(projectId, userId)`

2. **Implémenter projectController.ts**
   - [ ] `GET /api/projects` - Liste projets
   - [ ] `POST /api/projects` - Créer projet
   - [ ] `GET /api/projects/:id` - Détail
   - [ ] `PUT /api/projects/:id` - Modifier
   - [ ] `DELETE /api/projects/:id` - Supprimer
   - [ ] `POST /api/projects/:id/members` - Ajouter membre
   - [ ] `DELETE /api/projects/:id/members/:userId` - Retirer

3. **Frontend - Composants projets**
   - [ ] `ProjectList.tsx` - Liste des projets
   - [ ] `ProjectCard.tsx` - Carte projet
   - [ ] `ProjectForm.tsx` - Formulaire création/édition
   - [ ] `ProjectDetail.tsx` - Vue détail

4. **Tests**
   - [ ] CRUD projets complet
   - [ ] Gestion des membres
   - [ ] Vérification des permissions

**Fichiers à modifier :**
- `backend/src/services/projectService.ts`
- `backend/src/controllers/projectController.ts`
- `frontend/components/projects/*`
- `frontend/app/dashboard/page.tsx`

---

### Phase 3 : Tickets (Priorité 🔴)

1. **Implémenter ticketService.ts**
   - [ ] `createTicket(projectId, data)`
   - [ ] `getTickets(projectId)`
   - [ ] `getTicketById(id)`
   - [ ] `updateTicket(id, data)`
   - [ ] `deleteTicket(id)`
   - [ ] `assignUser(ticketId, userId)`
   - [ ] `unassignUser(ticketId, userId)`
   - [ ] `updateStatus(ticketId, status)`

2. **Time Tracking**
   - [ ] `startTracking(ticketId, userId)`
   - [ ] `stopTracking(ticketId, userId)`
   - [ ] `getTimeSpent(ticketId)`
   - [ ] Calcul automatique du temps passé

3. **Implémenter ticketController.ts**
   - [ ] `GET /api/projects/:id/tickets`
   - [ ] `POST /api/projects/:id/tickets`
   - [ ] `PUT /api/tickets/:id`
   - [ ] `DELETE /api/tickets/:id`
   - [ ] `POST /api/tickets/:id/time-tracking/start`
   - [ ] `POST /api/tickets/:id/time-tracking/stop`

4. **Frontend - Composants tickets**
   - [ ] `TicketList.tsx`
   - [ ] `TicketCard.tsx`
   - [ ] `TicketForm.tsx`
   - [ ] `TimeTracker.tsx` - Widget time tracking

5. **Tests**
   - [ ] CRUD tickets
   - [ ] Time tracking start/stop
   - [ ] Assignation utilisateurs
   - [ ] Changement de statut

**Fichiers à modifier :**
- `backend/src/services/ticketService.ts`
- `backend/src/controllers/ticketController.ts`
- `frontend/components/tickets/*`

---

### Phase 4 : Tests & Documentation (Priorité 🟡)

1. **Tests Backend**
   - [ ] Setup Jest
   - [ ] Tests unitaires services
   - [ ] Tests d'intégration API
   - [ ] Tests middleware auth

2. **Tests Frontend**
   - [ ] Setup Testing Library
   - [ ] Tests composants UI
   - [ ] Tests hooks custom
   - [ ] Tests intégration

3. **Documentation API**
   - [ ] Documenter tous les endpoints
   - [ ] Exemples de requêtes/réponses
   - [ ] Codes d'erreur possibles

---

## 🔧 Configuration des services externes

### Stripe (Paiements)

\`\`\`bash
# 1. Créer un compte Stripe : https://stripe.com
# 2. Récupérer les clés test (sk_test_... et pk_test_...)
# 3. Ajouter dans .env :
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# 4. Créer 3 produits :
#    - Perso : €19/mois
#    - Agence : €49/mois
#    - Entreprise : Sur devis

# 5. Configurer webhook :
#    URL : http://localhost:4000/api/stripe/webhook
#    Events : customer.subscription.*, invoice.*
\`\`\`

### Google OAuth

\`\`\`bash
# 1. Google Cloud Console : https://console.cloud.google.com
# 2. Créer un projet
# 3. Activer Google+ API
# 4. Créer credentials OAuth 2.0
# 5. Redirect URI : http://localhost:4000/api/auth/google/callback
# 6. Ajouter dans .env :
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
\`\`\`

### Firebase (Auth)

\`\`\`bash
# 1. Firebase Console : https://console.firebase.google.com
# 2. Créer un projet
# 3. Activer Authentication
# 4. Activer Email/Password et Google
# 5. Récupérer les clés de config
# 6. Ajouter dans .env :
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
# etc.
\`\`\`

---

## 📚 Commandes utiles

### Développement quotidien

\`\`\`bash
# Démarrer
scripts\dev.bat start

# Voir les logs
scripts\dev.bat logs

# Arrêter
scripts\dev.bat stop

# Rebuild après changements
scripts\dev.bat rebuild
\`\`\`

### Gestion de la base de données

\`\`\`bash
# Ouvrir Prisma Studio (GUI de la BDD)
scripts\dev.bat prisma:studio
# Puis ouvrir : http://localhost:5555

# Créer une nouvelle migration
scripts\dev.bat prisma:migrate

# Seed la base
scripts\dev.bat prisma:seed

# Reset complet (⚠️ destructif)
scripts\dev.bat prisma:reset
\`\`\`

### Accès aux shells

\`\`\`bash
# Shell backend
scripts\dev.bat shell-backend

# Shell frontend
scripts\dev.bat shell-frontend
\`\`\`

---

## 🎓 Ressources pour le développement

### Documentation technique
- **Prisma** : https://www.prisma.io/docs
- **Next.js** : https://nextjs.org/docs
- **Express** : https://expressjs.com/
- **Stripe** : https://stripe.com/docs
- **JWT** : https://jwt.io/introduction

### Tutorials recommandés
- Prisma Quickstart : https://www.prisma.io/docs/getting-started
- Next.js App Router : https://nextjs.org/docs/app
- Stripe Subscriptions : https://stripe.com/docs/billing/subscriptions/overview

### Outils utiles
- **Postman** : Tester les API endpoints
- **Prisma Studio** : GUI pour la base de données
- **Docker Desktop** : Gérer les conteneurs
- **VS Code** : Extensions recommandées :
  - Prisma
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

---

## 🐛 Troubleshooting courants

### Services ne démarrent pas
\`\`\`bash
# Vérifier Docker Desktop est lancé
docker --version

# Nettoyer et redémarrer
scripts\dev.bat clean
scripts\dev.bat start
\`\`\`

### Erreur Prisma
\`\`\`bash
# Régénérer le client
docker-compose exec backend npm run prisma:generate

# Relancer migrations
docker-compose exec backend npm run prisma:migrate
\`\`\`

### Port déjà utilisé
\`\`\`bash
# Windows : Trouver et tuer le processus
netstat -ano | findstr "3000"
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.yml
\`\`\`

---

## 📊 Objectifs Sprint 2

**Deadline suggérée** : 2 semaines

### Week 1
- ✅ Setup complet (FAIT)
- [ ] Auth complète (register, login, JWT)
- [ ] CRUD Projets complet
- [ ] Tests auth + projets

### Week 2
- [ ] CRUD Tickets complet
- [ ] Time tracking fonctionnel
- [ ] Frontend : composants projets + tickets
- [ ] Tests tickets + time tracking
- [ ] Documentation API

---

## 🎯 Critères de succès

Sprint 2 sera considéré terminé quand :

1. ✅ Un utilisateur peut s'inscrire et se connecter
2. ✅ Un utilisateur peut créer, modifier, supprimer des projets
3. ✅ Un utilisateur peut inviter d'autres membres à un projet
4. ✅ Un utilisateur peut créer, modifier, supprimer des tickets
5. ✅ Un utilisateur peut démarrer/arrêter le time tracking sur un ticket
6. ✅ Les tests unitaires passent à 80%+
7. ✅ La documentation API est à jour

---

## 🚀 Après Sprint 2

Une fois Sprint 2 terminé, vous pourrez passer à :

- **Sprint 3** : Kanban avec drag & drop
- **Sprint 4** : Devis et factures
- **Sprint 5** : Lien client sécurisé
- **Sprint 6** : Intégration Stripe complète
- **Sprint 7** : Admin dashboard
- **Sprint 8** : Optimisations et polish

Consultez `docs/SPRINTS.md` pour le détail complet.

---

## ✨ Conseils pour réussir

1. **Commencez petit** : Implémentez une feature complète (auth) avant de passer à la suivante
2. **Testez souvent** : Ne pas accumuler de code non testé
3. **Commit régulièrement** : Commits atomiques avec messages clairs
4. **Documentez** : Commentez le code complexe, mettez à jour la doc
5. **Utilisez Prisma Studio** : Pratique pour voir les données en temps réel

---

## 📞 Besoin d'aide ?

- Consultez la documentation dans `docs/`
- Regardez les fichiers existants comme exemples
- Utilisez Prisma Studio pour inspecter la BDD
- Testez les endpoints avec Postman

**Bon développement ! 🎉**
