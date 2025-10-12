# 🗓️ SPRINTS.md — Plan de développement du projet Kanban Time Tracker

## 🧩 Sprint 0 — Initialisation du projet
**Objectif :** Mettre en place l’environnement de développement et la structure du projet.

### Tâches :
- Créer la structure du monorepo :
/frontend
/backend
/docs

- Initialiser le projet **React + TypeScript + Vite** (frontend)
- Initialiser le projet **Node.js + Express + TypeScript** (backend)
- Configurer Tailwind CSS, Zustand, React Router
- Ajouter ESLint, Prettier, tsconfig
- Configurer Sequelize (PostgreSQL)
- Créer `.env.example` et fichiers de config
- Mettre en place le thème clair/sombre (frontend)
- Tester les commandes `npm run dev` sur les deux environnements

### Livrable :
- Projet fonctionnel et propre prêt pour les features
- Base de données connectée localement

---

## 🧠 Sprint 1 — Gestion du Kanban (Base)
**Objectif :** Créer la logique de base du Kanban et son affichage dynamique.

### Tâches :
- Créer les modèles `Project`, `Board`, `Card`, `Task`
- Mettre en place les routes API :
- `GET /boards`, `POST /boards`
- `GET /cards`, `POST /cards`
- `PATCH /cards/:id` (drag & drop)
- Créer les composants React :
- BoardList
- Column (Kanban)
- CardItem
- Intégrer le **drag & drop** (React Beautiful DnD)
- Connecter le frontend et le backend via Axios
- Ajouter un état global (Zustand) pour la gestion des tâches

### Livrable :
- Kanban dynamique fonctionnel avec data persistée
- Ajout, déplacement, suppression de cartes fonctionnel

---

## ⏱️ Sprint 2 — Gestion du temps et Timeline
**Objectif :** Ajouter la timeline (vue Gantt simplifiée) et le suivi du temps.

### Tâches :
- Créer un modèle `TimeEntry` (liée à chaque tâche)
- Intégrer une API `/time` (CRUD)
- Intégrer une timeline (React Gantt ou Recharts)
- Chaque tâche affiche :
- Temps prévu (chef de projet)
- Temps réel (tracker)
- Synchroniser le tracker avec les tâches
- Sur la timeline, superposer les temps prévus et réels pour comparaison

### Livrable :
- Timeline interactive affichant les tâches planifiées et réelles
- Tracker de temps fonctionnel par tâche

---

## 💰 Sprint 3 — Devis, coûts et rentabilité
**Objectif :** Intégrer une logique de coûts pour chaque tâche et automatiser la création de devis.

### Tâches :
- Ajouter un champ `cost` sur les tâches
- Créer un module `Devis` :
- Import d’un fichier devis (JSON ou CSV)
- Analyse du contenu → création automatique des tâches associées
- Calculer la rentabilité :
- Afficher le coût prévu / réel
- Générer un rapport global du projet
- Créer un écran “Rapports” (totaux, graphiques, stats)

### Livrable :
- Générateur et analyseur de devis fonctionnel
- Vue rapport synthétique avec rentabilité par projet

---

## 🧭 Sprint 4 — Templates de projets
**Objectif :** Faciliter la duplication de configurations entre projets.

### Tâches :
- Créer un modèle `Template`
- Permettre la sauvegarde d’un projet comme template
- Ajouter la possibilité d’importer un template à la création d’un nouveau projet
- Synchroniser la structure (colonnes, types de tâches, paramètres de temps)
- Interface de gestion des templates (liste, import, export)

### Livrable :
- Import/export de templates fonctionnel
- Création rapide de nouveaux projets via template

---

## 🔒 Sprint 5 — Authentification & gestion d’équipe
**Objectif :** Gérer plusieurs utilisateurs et leurs permissions.

### Tâches :
- Ajouter `User` et `Team` dans le backend
- Authentification via JWT
- Création / ajout de membres à un projet
- Permissions : admin / membre / invité
- Page de connexion + inscription + gestion de profil

### Livrable :
- Authentification complète
- Projets partagés entre utilisateurs

---

## 🌈 Sprint 6 — Améliorations UX/UI & intégrations
**Objectif :** Finaliser le produit avec des optimisations UX et intégrations tierces.

### Tâches :
- Améliorer le design global (polices, espaces, transitions)
- Intégrer un système de notifications
- Export PDF/CSV des rapports
- Intégration Clockify ou API tierce de tracking
- Mode offline (IndexedDB / cache local)
- Tests unitaires et end-to-end (Vitest + Playwright)

### Livrable :
- Interface fluide et intuitive
- Version stable utilisable en production

---

## 🚀 Sprint 7 — Déploiement & maintenance
**Objectif :** Mettre le projet en ligne et automatiser les processus.

### Tâches :
- Ajouter Docker pour backend + frontend
- Configurer un pipeline CI/CD (GitHub Actions)
- Héberger sur Vercel (frontend) + Render/Neon (backend)
- Ajouter la documentation utilisateur
- Préparer la roadmap d’évolution

### Livrable :
- Projet déployé et documenté
- Pipeline automatisé

---

## 🧭 Notes pour Cursor
- Chaque sprint correspond à une **demande distincte**.
- Tu peux appeler `@readme("./docs/SPRINTS.md")` pour cibler un sprint précis (par exemple "Sprint 2") dans Cursor.
- Le `CONTEXT_README.md` décrit le projet et les personas, tandis que ce fichier décompose le développement.
- Les images ou maquettes peuvent être stockées dans `/docs/ui` et référencées selon le sprint concerné.
