# 🧭 CONTEXT_README.md — Kanban Time Tracker

## 🎯 Objectif du projet
Développer un **outil de gestion de projet complet** combinant :
- Un **Kanban interactif**
- Une **timeline (vue Gantt simplifiée)**
- Un **tracker de temps**
- Un **générateur de devis et rapport de rentabilité**
- Un **système de templates réutilisables**
- Une **gestion multi-projet et multi-utilisateur**
- Un **back-office d’administration complet**

Le tout destiné à **freelances**, **agences**, et **chefs de projet** souhaitant centraliser **suivi, planification et rentabilité** au même endroit.

---

## 👥 Personas principaux

### 🧑‍💻 Freelance
- Suit le temps passé sur ses tâches
- Utilise les templates pour créer rapidement un nouveau projet client
- Souhaite voir la rentabilité projet par projet

### 🧑‍🏫 Chef de projet / Agence
- Crée des devis détaillés à partir des tâches
- Suit le temps prévu vs réel pour chaque membre
- Visualise la timeline et compare les écarts de planification
- Utilise les rapports pour évaluer la performance de l’équipe

### 👥 Membre d’équipe
- Voit uniquement ses tâches assignées
- Lance le tracker pour suivre son temps
- Consulte ses statistiques personnelles

### 🧑‍💼 Administrateur (Back-Office)
- Supervise l’ensemble des projets, équipes et utilisateurs
- Accède aux métriques globales de performance et de charge
- Consulte les logs d’erreur, incidents et statistiques système
- Gère les paramètres généraux de l’application (droits, quotas, intégrations)
- Supervise la facturation ou les plans tarifaires (si SaaS)

---

## 🏗️ Architecture générale

├── /frontend # Application React + TypeScript + Vite
│ ├── /src
│ │ ├── /components # UI (Kanban, Timeline, Timer, Charts…)
│ │ ├── /pages # Dashboard, Boards, Reports, Settings, Admin…
│ │ ├── /store # Zustand (état global)
│ │ ├── /hooks # Hooks personnalisés
│ │ ├── /services # API calls via Axios
│ │ ├── /styles # Tailwind + thèmes personnalisés
│ │ └── /utils # Helpers et fonctions globales
│ ├── vite.config.ts
│ └── tsconfig.json
│
├── /backend # API Node.js + Express + TypeScript
│ ├── /src
│ │ ├── /models # Sequelize (User, Board, Card, TimeEntry, Template, Log…)
│ │ ├── /routes # Endpoints REST (auth, boards, time, reports, admin…)
│ │ ├── /controllers # Logique métier
│ │ ├── /middlewares # Auth, erreurs, validations, logging
│ │ ├── /services # Tâches backend (mails, monitoring, analytics)
│ │ ├── /config # Base de données, environnement
│ │ └── /utils # Helpers backend
│ ├── package.json
│ └── tsconfig.json
│
├── /docs # Documentation projet
│ ├── CONTEXT_README.md # Ce fichier
│ └── SPRINTS.md # Feuille de route de développement
│
├── /docker # Configuration Docker (frontend + backend + db)
│
└── README.md # Documentation principale (accueil du repo)

---

## ⚙️ Stack technique

### Frontend
- **React + TypeScript + Vite**
- **Tailwind CSS** pour le design
- **Zustand** pour la gestion d’état
- **React Router** pour le routage
- **Recharts** ou **Visx** pour les graphiques
- **Framer Motion** pour les animations
- **Axios** pour la communication API

### Backend
- **Node.js + Express + TypeScript**
- **PostgreSQL + Sequelize ORM**
- **JWT** pour l’authentification
- **Helmet / CORS / Rate limiting** pour la sécurité
- **Winston / Pino** pour la journalisation
- **PM2 ou BullMQ** pour la surveillance et la planification

### Outils et intégrations
- **Docker** pour le déploiement
- **GitHub Actions** pour CI/CD
- **Clockify API** (optionnelle)
- **Sentry** pour le monitoring et le logging d’erreurs
- **Export CSV / PDF / Excel**
- **Hébergement :** Vercel (frontend), Render / Neon (backend + DB)

---

## 🧩 Modules fonctionnels

### 1. Kanban
- Drag & drop des cartes
- Filtres et recherche
- Statut et priorité par colonne

### 2. Timeline
- Vue Gantt simplifiée
- Comparaison temps prévu / réel
- Alertes sur retards ou dépassements

### 3. Time Tracker
- Chronomètre par tâche
- Historique des sessions
- Statistiques de productivité

### 4. Devis & Rentabilité
- Génération automatique à partir d’un import (JSON / CSV)
- Calcul des coûts prévus et réels
- Visualisation de la marge

### 5. Templates
- Sauvegarde et import de modèles de projets
- Réutilisation de structures complètes (colonnes, temps, coûts)

### 6. Collaboration & Authentification
- Rôles utilisateurs (Admin / Membre / Invité)
- Assignations et notifications
- Gestion d’équipe et permissions

### 7. Reporting
- Graphiques de progression
- Export PDF / CSV
- Vue détaillée par utilisateur et par projet

### 8. **Back-Office / Administration**
- Dashboard global d’administration
- Statistiques globales (nombre de projets, utilisateurs actifs, temps total, erreurs)
- Journalisation des erreurs (backend, frontend, API)
- Liste des événements critiques (échecs de login, quotas, plantages)
- Gestion des comptes utilisateurs (blocage, suppression, réinitialisation)
- Paramètres globaux de l’application (thèmes, quotas, intégrations)
- Gestion des intégrations externes (Clockify, Slack, etc.)
- Vue système : charge serveur, uptime, logs, utilisation DB
- Notifications automatiques en cas d’incident
- (Optionnel) gestion des plans tarifaires si passage en SaaS

---

## 🧠 Organisation de développement

Le développement se fait par **SPRINTS** définis dans [`SPRINTS.md`](./SPRINTS.md).  
Chaque sprint est autonome et contient :
- Objectif
- Tâches techniques
- Livrables attendus

Dans Cursor, il suffit d’appeler :
```bash
@readme("./docs/CONTEXT_README.md")
@readme("./docs/SPRINTS.md") Sprint 2