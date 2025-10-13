# 🎯 Kanban Time Tracker

Outil de gestion de projet complet combinant Kanban, Timeline (Gantt), Time Tracker, et générateur de devis.

## 📋 Description

Un système de gestion de projet moderne destiné aux freelances, agences et chefs de projet pour centraliser le suivi, la planification et la rentabilité de leurs projets.

### Fonctionnalités principales

- 📊 **Kanban interactif** avec drag & drop et colonnes personnalisables
- ⏱️ **Time Tracker** intégré avec sessions détaillées et rapports
- 💰 **Système de devis complet** avec rendu en temps réel et export PDF
- 📈 **Analyse de rentabilité** avec graphiques et statistiques avancées
- 🏢 **Gestion d'entreprise** avec paramètres complets (SIRET, TVA, logo)
- 👤 **Association client-projet** avec informations automatiques
- 📋 **5 vues de projet** : Résumé, Kanban, Liste, Temps, Devis
- 📐 **Templates de projets** réutilisables (à venir)
- 👥 **Gestion multi-utilisateur** et multi-projet (à venir)
- 🎨 **Interface moderne** avec thème clair/sombre et design responsive

## 🏗️ Architecture

Ce projet est organisé en monorepo avec :

- **`/frontend`** - Application React + TypeScript + Vite
- **`/backend`** - API Node.js + Express + TypeScript
- **`/docs`** - Documentation du projet

## 🚀 Installation

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

### Installation rapide

```bash
# Installer toutes les dépendances
npm run install:all

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Éditer les fichiers .env avec vos paramètres
```

### Configuration de la base de données

**Option 1 : Avec Docker (Recommandé)**

```bash
docker-compose up -d
```

**Option 2 : PostgreSQL local**

1. Créer une base de données PostgreSQL :

```sql
CREATE DATABASE kanban_time_tracker;
```

2. Modifier le fichier `backend/.env` avec vos credentials PostgreSQL

### Démarrage

```bash
# Démarrer frontend et backend simultanément
npm run dev

# OU démarrer séparément

# Frontend seulement (port 3000)
npm run dev:frontend

# Backend seulement (port 5000)
npm run dev:backend
```

## 📁 Structure du projet

```
/
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── store/           # État global (Zustand)
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── services/        # Services API
│   │   ├── styles/          # Styles Tailwind
│   │   └── utils/           # Utilitaires
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── models/          # Modèles Sequelize
│   │   ├── routes/          # Routes API
│   │   ├── controllers/     # Contrôleurs
│   │   ├── middlewares/     # Middlewares
│   │   ├── config/          # Configuration
│   │   └── utils/           # Utilitaires
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── CONTEXT_README.md    # Contexte du projet
│   └── SPRINTS.md           # Plan de développement
│
└── package.json             # Configuration monorepo
```

## 🛠️ Stack technique

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (gestion d'état)
- React Router
- Axios
- Framer Motion
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT (authentification)
- Helmet & CORS (sécurité)
- Docker & Docker Compose

## 📖 Documentation

- [CONTEXT_README.md](./docs/CONTEXT_README.md) - Contexte complet du projet
- [SPRINTS.md](./docs/SPRINTS.md) - Plan de développement par sprints

## 🎨 Thème

L'application supporte les thèmes clair et sombre. Le thème est persisté dans le localStorage et peut être changé depuis les paramètres ou le tableau de bord.

## 📝 Scripts disponibles

### Racine du projet

- `npm run dev` - Démarre frontend et backend
- `npm run dev:frontend` - Démarre uniquement le frontend
- `npm run dev:backend` - Démarre uniquement le backend
- `npm run install:all` - Installe toutes les dépendances

### Frontend

- `npm run dev` - Mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Linter le code
- `npm run format` - Formater le code

### Backend

- `npm run dev` - Mode développement avec hot reload
- `npm run build` - Compiler TypeScript
- `npm run start` - Démarrer en production
- `npm run lint` - Linter le code
- `npm run format` - Formater le code

## 🔗 API Endpoints

### Devis & Rentabilité
- `GET /api/quote/board/:boardId` - Récupérer les devis d'un projet
- `POST /api/quote` - Créer un nouveau devis
- `PUT /api/quote/:id` - Mettre à jour un devis
- `DELETE /api/quote/:id` - Supprimer un devis
- `POST /api/quote/board/:boardId/generate` - Générer un devis depuis les tâches
- `POST /api/quote/board/:boardId/import` - Importer un devis (JSON/CSV)
- `GET /api/quote/board/:boardId/profitability` - Statistiques de rentabilité
- `GET /api/quote/board/:boardId/tasks` - Tâches disponibles pour devis

### Paramètres d'entreprise
- `GET /api/company-settings` - Récupérer les paramètres d'entreprise
- `PUT /api/company-settings` - Mettre à jour les paramètres d'entreprise
- `POST /api/company-settings/reset` - Réinitialiser les paramètres par défaut

### Projets (avec informations client)
- `GET /api/boards` - Liste des projets avec informations client
- `POST /api/boards` - Créer un projet avec client
- `PUT /api/boards/:id` - Mettre à jour un projet et ses informations client

## 🛣️ Routes Frontend

### Pages principales
- `/` - Dashboard principal
- `/boards` - Liste des projets
- `/reports` - Rapports et statistiques
- `/settings` - Paramètres d'entreprise

### Pages de projet
- `/project/:id` - Vue projet (5 onglets : Résumé, Kanban, Liste, Temps, Devis)
- `/project/:id/settings` - Paramètres du projet et client

### Pages de devis
- `/project/:boardId/quote/create` - Création de devis avec rendu temps réel

## 🗺️ Roadmap

- [x] Sprint 0 - Initialisation du projet
- [x] Sprint 1 - Gestion du Kanban (Base)
- [x] Sprint 2 - Gestion du temps et Timeline
- [x] Sprint 3 - Devis, coûts et rentabilité
- [ ] Sprint 4 - Templates de projets
- [ ] Sprint 5 - Authentification & gestion d'équipe
- [ ] Sprint 6 - Améliorations UX/UI & intégrations
- [ ] Sprint 7 - Déploiement & maintenance

## 📄 Licence

Ce projet est privé et destiné à un usage personnel/professionnel.

## 👤 Auteur

Matthias - [Kanban Time Tracker](https://github.com/Matth-Ben)

## 🎯 Fonctionnalités actuelles (Sprint 1 + 2 + 3)

### Gestion de Projets

#### 5 Vues disponibles
- ✅ **📊 Vue Résumé** : Dashboard avec statistiques, progression, suivi temporel et rentabilité
- ✅ **📋 Vue Tableau** : Kanban visuel avec drag & drop
- ✅ **📝 Vue Liste** : Tableau détaillé avec 13 colonnes triables
- ✅ **⏱️ Vue Temps** : Suivi détaillé de toutes les sessions (style Clockify)
- ✅ **💰 Vue Devis** : Gestion complète des devis et analyse de rentabilité

### Kanban Board (Vue Tableau)
- ✅ Création et gestion de tableaux Kanban
- ✅ **Colonnes personnalisées** : Ajouter, renommer, supprimer et réorganiser les colonnes
- ✅ **Couleurs personnalisées** : Chaque colonne a sa propre couleur (12 couleurs prédéfinies + sélecteur)
- ✅ **Cartes colorées** : Les cartes affichent la couleur de leur statut en fond dégradé + bordure gauche
- ✅ **Sous-tâches** : Décomposer les cartes en sous-tâches avec progress bar automatique
- ✅ **Modal 2 colonnes** : Interface professionnelle type Trello/Jira
- ✅ **Description WYSIWYG** : Éditeur de texte riche avec preview
- ✅ **Commentaires** : Système de discussion sur les cartes
- ✅ **Historique** : Journal complet des modifications
- ✅ **Détails avancés** : Rapporteur, catégorie, étiquettes, dates, suivi temporel
- ✅ **Statuts dynamiques** : Chaque tableau a ses propres statuts/colonnes
- ✅ Drag & drop des cartes entre colonnes
- ✅ Recherche par mot-clé
- ✅ Filtrage par priorité (haute, moyenne, basse)
- ✅ Gestion complète des cartes (CRUD)
- ✅ Synchronisation automatique des dates selon le statut
- ✅ Interface moderne et responsive
- ✅ Thème clair/sombre personnalisé (#1c1a1b + #a8ff99)

### Champs avancés des cartes
- ✅ **Clé unique** : Génération automatique (PROJ-123)
- ✅ **Rapporteur** : Qui a créé la tâche
- ✅ **Catégorie** : Classification (Développement, Design, Bug, etc.)
- ✅ **Étiquettes** : Tags multiples
- ✅ **Dates** : Début, échéance, complétion
- ✅ **Temps** : Estimé, réel (calculé automatiquement), avec indicateur de dépassement

### Time Tracker (Sprint 2) ⏱️

#### Time Tracker intégré aux cartes
- ✅ **Timer Start/Pause/Stop** : Directement dans chaque carte Kanban et dans le modal
- ✅ **Sessions enregistrées** : Chaque session avec durée, description, timestamps
- ✅ **Gestion des pauses** : Pause automatique avec décompte
- ✅ **Calcul automatique** : Le temps réel se met à jour automatiquement
- ✅ **Affichage en temps réel** : Timer avec format HH:MM:SS
- ✅ **Mode compact** : Timer minimal dans les cartes Kanban
- ✅ **Mode détaillé** : Timer complet dans le modal de carte

#### Vue Temps (TimeTracker)
- ✅ **Liste complète** : Toutes les sessions du projet
- ✅ **Groupement par jour** : Organisation chronologique claire
- ✅ **Filtres avancés** : Par date et par carte
- ✅ **Édition complète** : Modal pour modifier description, heures, durée
- ✅ **Suppression** : Possibilité de supprimer les sessions
- ✅ **Lien vers les tickets** : Click pour ouvrir la carte associée
- ✅ **Totaux** : Par jour et global
- ✅ **Interface Clockify** : Design inspiré des meilleurs outils

#### Rapports et Statistiques
- ✅ **Page Rapports** : Graphiques et analyses détaillées
- ✅ **Groupement flexible** : Par carte, jour ou projet
- ✅ **Graphique à barres** : Temps par entité
- ✅ **Graphique circulaire** : Répartition du temps (Top 6)
- ✅ **Export CSV** : Téléchargement des données pour Excel
- ✅ **Statistiques temps réel** : Temps total, sessions, moyennes
- ✅ **Filtres** : Par projet, période, groupement

#### Vue Résumé enrichie
- ✅ **Temps total calculé** : Somme de toutes les TimeEntries du projet
- ✅ **Nombre de sessions** : Compteur global
- ✅ **Barre de progression** : Comparaison temps estimé vs temps passé
- ✅ **Indicateur dépassement** : Alerte visuelle si hors délai
- ✅ **Top 5 des cartes** : Classement par temps passé
- ✅ **Détail des sessions** : Pour chaque carte du Top 5

#### Détails des cartes
- ✅ **Liste des sessions** : Historique complet des TimeEntries
- ✅ **Temps réel automatique** : Calculé depuis les sessions enregistrées
- ✅ **Comparaison estimé/réel** : Avec pourcentage et écart
- ✅ **Affichage des pauses** : Info sur les pauses enregistrées

### Devis & Rentabilité (Sprint 3) 💰

#### Gestion des devis
- ✅ **Création de devis** : Page complète avec rendu en temps réel (style Portail Auto-Entrepreneur)
- ✅ **Génération automatique** : Depuis les tâches du projet avec sélection personnalisée
- ✅ **Import de devis** : Format JSON et CSV avec création automatique des tâches
- ✅ **Association client-projet** : Chaque projet peut avoir un client associé
- ✅ **Paramètres d'entreprise** : Configuration complète (nom, adresse, SIRET, TVA, logo)
- ✅ **Export PDF** : Génération de devis professionnels avec informations entreprise

#### Création de devis avancée
- ✅ **Interface complète** : Formulaire + aperçu en temps réel
- ✅ **Apparence personnalisable** : Couleur du devis et logo
- ✅ **Informations client** : Récupération automatique depuis le projet
- ✅ **Produits et services** : Lignes dynamiques avec types (Tâche, Service, Matériel, Remise)
- ✅ **Calculs automatiques** : Quantité × Prix, sous-total, marge, total HT
- ✅ **Conditions de livraison** : Délais, mode, adresse
- ✅ **Conditions de paiement** : Délais, mode, acompte, coordonnées bancaires

#### Vue Devis
- ✅ **Liste des devis** : Tous les devis du projet avec statuts
- ✅ **Détails complets** : Modal avec toutes les informations et lignes
- ✅ **Statuts** : Brouillon, Envoyé, Accepté, Rejeté, Facturé
- ✅ **Actions** : Édition, suppression, export PDF
- ✅ **Filtrage** : Par statut et période

#### Analyse de rentabilité
- ✅ **Graphiques de rentabilité** : Comparaison estimé vs réel par devis
- ✅ **Statistiques globales** : Montants totaux, rentabilité moyenne, nombre de devis
- ✅ **État des devis** : Cartes individuelles avec progression visuelle
- ✅ **Tableau détaillé** : Analyse complète avec statuts et marges
- ✅ **Indicateurs de performance** : Rentabilité par devis avec codes couleur

#### Paramètres d'entreprise
- ✅ **Page dédiée** : Configuration complète des informations entreprise
- ✅ **Informations générales** : Nom, adresse, ville, code postal, pays
- ✅ **Contact** : Téléphone, email, site web
- ✅ **Informations légales** : SIRET, numéro de TVA
- ✅ **Paramètres par défaut** : Taux horaire, marge, devise, langue
- ✅ **Aperçu en temps réel** : Visualisation des informations formatées
- ✅ **Validation** : Contrôles de saisie et messages d'erreur

#### Paramètres de projet
- ✅ **Page dédiée** : Configuration du projet et du client associé
- ✅ **Informations projet** : Nom, description, couleur
- ✅ **Informations client** : Nom, email, téléphone, adresse
- ✅ **Aperçu** : Visualisation des informations projet + client
- ✅ **Intégration devis** : Utilisation automatique des informations client

#### Intégrations
- ✅ **Association tâches-devis** : Lignes de devis liées aux cartes du projet
- ✅ **Calcul temps réel** : Heures réelles calculées depuis les TimeEntries
- ✅ **Suivi de progression** : Avancement des devis vs temps passé
- ✅ **Export PDF professionnel** : Devis avec en-tête entreprise et informations légales

### Pour tester

#### Gestion de base
1. Démarrer le projet avec `npm run dev`
2. Aller sur http://localhost:3000/boards (maintenant "Projets")
3. Créer un projet avec le bouton "➕ Nouveau projet"
4. Choisir une vue : 📊 Résumé / 📋 Tableau / 📝 Liste / ⏱️ Temps / 💰 Devis

#### Vue Tableau (Kanban)
5. Drag & drop des cartes entre colonnes
6. Cliquer sur une carte pour l'éditer (modal 2 colonnes)
7. Personnaliser les colonnes avec le bouton "⚙️ Colonnes"

#### Vue Liste
8. Cliquer sur une colonne pour trier
9. Cliquer sur une ligne pour ouvrir le modal

#### Time Tracker
10. Ouvrir une carte et cliquer sur "▶️ Démarrer" le timer
11. Le timer s'incrémente en temps réel (HH:MM:SS)
12. Utiliser les boutons ⏸️ Pause et ⏹️ Stop
13. Aller dans l'onglet "⏱️ Temps" pour voir toutes les sessions
14. Cliquer sur une session pour l'éditer

#### Rapports
15. Aller dans 📊 Rapports (menu de gauche)
16. Sélectionner les filtres (projet, dates, groupement)
17. Voir les graphiques et statistiques
18. Exporter en CSV avec le bouton "📥 Exporter CSV"

#### Devis & Rentabilité
19. Aller dans l'onglet "💰 Devis" d'un projet
20. Cliquer sur "➕ Nouveau" pour créer un devis avec rendu en temps réel
21. Configurer les paramètres d'entreprise dans "⚙️ Paramètres" (menu principal)
22. Configurer les informations client dans "⚙️ Paramètres" du projet
23. Utiliser "⚡ Auto" pour générer un devis depuis les tâches
24. Voir les graphiques de rentabilité dans l'onglet "📊 Résumé"
25. Exporter un devis en PDF avec le bouton "📄 PDF"

#### Paramètres
26. Aller dans "⚙️ Paramètres" (menu principal) pour configurer l'entreprise
27. Aller dans "⚙️ Paramètres" d'un projet pour configurer le client
28. Voir les aperçus en temps réel des informations

Voir [TEST_DATA.md](./TEST_DATA.md) et [INSTALLATION.md](./INSTALLATION.md) pour plus de détails.

---

**Note :** Sprint 1, 2 & 3 terminés ! Le Kanban, Time Tracking et système de Devis sont pleinement fonctionnels. Prochain sprint : Templates de projets.

