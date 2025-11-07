# 🏃 Sprints – SaaS Gestion de Projets Web

Ce document décrit l'ordre de développement recommandé pour le projet, avec objectifs, fonctionnalités, dépendances et priorités par sprint.

---

## Sprint 1 – Fondations & Authentification

**Objectif :** Poser les bases sécurisées du SaaS.

**Fonctionnalités :**
- Authentification : login/register (email + Google OAuth)
- Mot de passe oublié / reset
- JWT pour sessions sécurisées
- Middleware de sécurité pour API routes
- Gestion des rôles : freelance / agency / enterprise / admin
- Création des organisations et liaison utilisateurs

**BDD :**
- `User`, `Organization`

**Priorité : 🔴 très haute**
**Dépendances :** aucun, base du projet

---

## Sprint 2 – Gestion des projets & tickets (core)

**Objectif :** Créer l’ossature de gestion de projets.

**Fonctionnalités :**
- CRUD projets
- Assignation utilisateurs
- Historique & archivage
- CRUD tickets : titre, description, statut, priorité, assignees, temps estimé
- Time tracking par ticket
- Vue projet avec liste tickets

**BDD :**
- `Project`, `Ticket`, `Document` (partiellement pour stockage initial)

**Priorité : 🔴 très haute**
**Dépendances :** Sprint 1 terminé

---

## Sprint 3 – Kanban & modèles de projets

**Objectif :** Ajouter une interface visuelle Kanban.

**Fonctionnalités :**
- Vue Kanban par projet (ToDo/InProgress/Done)
- Drag & drop tickets
- Modèles de Kanban préconfigurés pour projets

**BDD :**
- `Ticket` déjà existants, `Project` pour relation

**Priorité : 🟠 haute**
**Dépendances :** Sprint 2 terminé

---

## Sprint 4 – Devis / Factures / Contrats

**Objectif :** Lier gestion commerciale et tickets.

**Fonctionnalités :**
- CRUD devis, factures, contrats
- Signature électronique
- Validation devis → création automatique tickets
- Historique documents sécurisé
- Mise à jour métriques projet (prix, temps, collaborateurs)

**BDD :**
- `Invoice`, `Ticket`, `Project`, `Document`

**Priorité : 🟠 haute**
**Dépendances :** Sprint 2 et 3

---

## Sprint 5 – Lien client & documents

**Objectif :** Permettre suivi externe pour les clients.

**Fonctionnalités :**
- Accès lecture seule via lien sécurisé
- Tickets de recette et feedback
- Consultation et signature documents
- Upload fichiers par client

**BDD :**
- `Project`, `Ticket`, `Invoice`, `Document`

**Priorité : 🟡 moyenne**
**Dépendances :** Sprint 2, 3 et 4

---

## Sprint 6 – Abonnement & Paiement (Stripe)

**Objectif :** Monétiser le SaaS.

**Fonctionnalités :**
- Plans : Perso, Agence, Entreprise
- Essai gratuit 15 jours
- Paiement mensuel ou annuel
- Codes promo
- Upgrade/downgrade automatique
- Plan gratuit lecture seule après expiration
- Page Billing / gestion abonnement
- Webhooks Stripe sécurisés

**BDD :**
- `Subscription`, `User`

**Priorité : 🔴 très haute**
**Dépendances :** Sprint 1 terminé

---

## Sprint 7 – Administration / Back-office

**Objectif :** Surveiller et administrer la plateforme.

**Fonctionnalités :**
- Dashboard global : utilisateurs actifs, revenus, churn
- Support & Helpdesk interne
- Analytics utilisateur : parcours, usage, conversion
- Gestion abonnements et utilisateurs
- Export CSV / PDF des données

**BDD :**
- `SupportTicket`, `SupportComment`, `UserAnalytics`, `Subscription`, `User`, `Project`, `Ticket`, `Invoice`

**Priorité : 🟠 haute**
**Dépendances :** Sprint 2, 4 et 6

---

## Sprint 8 – Optimisations & fonctionnalités avancées

**Objectif :** Améliorations et stabilisation finale.

**Fonctionnalités :**
- Notifications email et in-app
- Reporting temps / performance / finances
- Optimisation UI/UX (responsive, mobile)
- Sécurité avancée : cryptage fichiers, audit logs
- Tests automatisés et CI/CD

**BDD :**
- Toutes les tables existantes pour statistiques et audits

**Priorité : 🟡 moyenne**
**Dépendances :** Sprint 1 à 7 complétés

---

## 🔹 Notes finales
- Chaque sprint doit inclure tests unitaires et d’intégration
- Prioriser la sécurité et la cohérence des permissions à chaque étape
- Les modules sont interconnectés : tickets → projets → abonnements → client → admin
- Livraison itérative recommandée pour avoir un MVP fonctionnel dès Sprint 2-3