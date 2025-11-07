# 📌 Context & Cahier Fonctionnel – SaaS Gestion de Projets Web

## 1. Objectif du projet
Ce SaaS est destiné aux professionnels du web et du logiciel (freelances, agences, entreprises) pour gérer leurs projets, tickets, devis, factures et collaborations. L’outil doit permettre :

- Gestion complète de projets type Kanban
- Suivi temps réel (time tracking)
- Création et gestion de devis, factures et contrats
- Collaboration multi-utilisateur
- Lien client sécurisé pour suivi et retour
- Gestion des abonnements payants via Stripe
- Back-office admin complet avec analytics et support interne

---

## 2. Stack technique
- **Frontend** : Next.js + React + TypeScript + Tailwind CSS
- **Backend / API** : Next.js API Routes, JWT pour sessions
- **Base de données** : PostgreSQL via Prisma
- **Authentification** : Firebase Auth + JWT + Google OAuth
- **Paiement & Abonnements** : Stripe (Checkout, Billing, Codes promo)
- **Stockage documents** : Drive crypté par projet
- **Analytics** : suivi des actions utilisateur et rapports admin
- **Notifications** : Email + in-app notifications
- **Tests / CI/CD** : Jest / Testing Library / GitHub Actions

---

## 3. Types d’utilisateurs et permissions
| Type | Rôle | Permissions principales |
|------|------|------------------------|
| Freelance | `freelance` | Projets propres, lien client, gestion tickets |
| Agence | `agency` | Multi-utilisateurs, partage projets, kanban collaboratif |
| Entreprise | `enterprise` | Gestion complète, analytics, support étendu |
| Admin | `admin` | Back-office complet, gestion abonnements, support, analytics |

- **Règles clés** :
  - Seul un admin peut gérer les abonnements et les utilisateurs autres que lui
  - Les collaborateurs voient uniquement les projets auxquels ils sont associés
  - Le lien client est **lecture seule + tickets de recette + signature de documents**

---

## 4. Fonctionnalités principales

### 4.1 Authentification
- Login / Register (email/password + Google OAuth)
- Mot de passe oublié / reset
- JWT pour sessions sécurisées
- Middleware pour sécuriser toutes les API routes
- Gestion des rôles (`freelance`, `agency`, `enterprise`, `admin`)

**BDD correspondante :** `User`
- `id`, `email`, `password`, `role`, `organizationId`, `subscriptionId`
- `createdAt`, `updatedAt`

**Warnings :**
- Vérifier la cohérence Firebase UID ↔ Prisma User
- Gestion des tokens JWT et expiration pour sécurité

---

### 4.2 Organisation & Utilisateurs
- Freelance peut être seul ou rattaché à agence/entreprise
- Agence/Entreprise peut ajouter des collaborateurs
- Permissions basées sur rôle
- Notifications sur changements de statut ou assignation de projet

**BDD correspondante :** `Organization`
- `id`, `name`, `type`, `users`, `projects`, `createdAt`, `updatedAt`

---

### 4.3 Projets
- CRUD projet
- Assignation utilisateurs / collaborateurs
- Historique & archivage automatique
- Documents associés (Drive crypté)
- Modèles préconfigurés avec Kanban

**BDD correspondante :** `Project`
- `id`, `name`, `description`, `organizationId`, `users`, `tickets`, `documents`
- `createdAt`, `updatedAt`

**Warnings :**
- Vérifier l’accès des utilisateurs au projet via middleware
- Limiter l’upload document selon plan d’abonnement

---

### 4.4 Tickets & Kanban
- CRUD tickets
- Assignation multi-utilisateur
- Statut : todo / in_progress / done
- Priorité : low / medium / high
- Time tracking : temps prévu vs réel
- Modèles Kanban pour projets préconfigurés
- Drag & drop dans la vue Kanban

**BDD correspondante :** `Ticket`
- `id`, `title`, `description`, `status`, `priority`, `estimatedTime`, `spentTime`, `projectId`, `assignees`

**Warnings :**
- Vérifier la cohérence des tickets lors de la création à partir d’un devis
- Limiter l’édition selon permissions et statut projet

---

### 4.5 Devis, Factures & Contrats
- Création, édition, signature électronique
- Lien avec tickets : validation → création automatique de tickets dans Kanban
- Historique & stockage sécurisé
- Mise à jour automatique des métriques projet

**BDD correspondante :** `Invoice`
- `id`, `projectId`, `type` (invoice/quote/contract), `amount`, `status`, `createdAt`, `updatedAt`

**Warnings :**
- Vérifier cohérence devis validé → tickets créés
- Sécuriser l’accès aux documents pour le client externe

---

### 4.6 Lien Client
- Accès lecture seule aux projets
- Tickets de recette et feedback
- Signature devis/facture/contrat
- Upload fichiers nécessaires au projet

**BDD correspondante :**
- `Project`, `Ticket`, `Invoice`, `Document`

**Warnings :**
- Ne jamais permettre de modification côté client autre que tickets de recette / signature
- URL de lien client sécurisée / unique

---

### 4.7 Time Tracking
- Bouton start/stop sur tickets
- Temps passé associé au ticket
- Comparaison temps prévu / temps réel

**BDD correspondante :**
- `Ticket.spentTime`, `estimatedTime`

**Warnings :**
- Vérifier le cumul temps par utilisateur et projet
- Synchronisation en temps réel si plusieurs collaborateurs sur même ticket

---

### 4.8 Abonnements & Paiements (Stripe)
- Plans : Perso, Agence, Entreprise (sur devis)
- Essai gratuit 15 jours
- Facturation mensuelle ou annuelle
- Codes promo
- Upgrade / downgrade automatique avec prorata
- Plan gratuit lecture seule après expiration

**BDD correspondante :** `Subscription`
- `id`, `userId`, `stripeCustomerId`, `stripeSubscriptionId`, `plan`, `status`, `trialEndsAt`, `currentPeriodEnd`

**Warnings :**
- Webhooks Stripe sécurisés
- Gestion automatique du read-only post-expiration
- Limitation des quotas selon plan

---

### 4.9 Support & Helpdesk
- Tickets internes pour support utilisateurs
- Création, suivi, réponse et archivage
- Notifications par mail / in-app

**BDD correspondante :** `SupportTicket` & `SupportComment`

---

### 4.10 Analytics Utilisateur
- Suivi connexions, temps passé, fonctionnalités utilisées
- Dashboard admin avec graphes et filtres
- Taux conversion essai → payant

**BDD correspondante :** `UserAnalytics`
- `lastLogin`, `sessionCount`, `featureUsage`

---

### 4.11 Sécurité
- Middleware pour rôles et permissions
- Cryptage documents et données sensibles
- Audit logs pour toutes les actions critiques

---

### 5. Architecture technique
- /api/
   - auth/
   - stripe/
   - projects/
   - tickets/
   - support/
   - analytics/
- /pages/
   - dashboard/
   - billing/
   - admin/
- /prisma/schema.prisma

---

### 6. Warnings généraux
- Vérifier les permissions avant toute modification
- Vérifier les quotas selon abonnement
- Webhooks Stripe sécurisés et idempotents
- Time tracking synchronisé entre plusieurs collaborateurs
- Lien client strictement lecture seule

---

### ✅ Résumé
Ce document décrit **toutes les fonctionnalités du SaaS**, les relations entre les modules et les tables Prisma correspondantes.  
En le suivant, un développeur peut comprendre **toutes les fonctionnalités et workflows** sans voir l’outil déjà développé.