# 🎯 Kanban Time Tracker

Outil de gestion de projet complet combinant Kanban, Timeline (Gantt), Time Tracker, et générateur de devis.

## 📋 Description

Un système de gestion de projet moderne destiné aux freelances, agences et chefs de projet pour centraliser le suivi, la planification et la rentabilité de leurs projets.

### Fonctionnalités principales

- 📊 **Kanban interactif** avec drag & drop
- 📅 **Timeline** (vue Gantt simplifiée)
- ⏱️ **Time Tracker** pour le suivi du temps
- 💰 **Générateur de devis** et analyse de rentabilité
- 📐 **Templates de projets** réutilisables
- 👥 **Gestion multi-utilisateur** et multi-projet
- 📈 **Rapports détaillés** avec graphiques

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

## 🗺️ Roadmap

- [x] Sprint 0 - Initialisation du projet
- [x] Sprint 1 - Gestion du Kanban (Base)
- [x] Sprint 2 - Gestion du temps et Timeline
- [ ] Sprint 3 - Devis, coûts et rentabilité
- [ ] Sprint 4 - Templates de projets
- [ ] Sprint 5 - Authentification & gestion d'équipe
- [ ] Sprint 6 - Améliorations UX/UI & intégrations
- [ ] Sprint 7 - Déploiement & maintenance

## 📄 Licence

Ce projet est privé et destiné à un usage personnel/professionnel.

## 👤 Auteur

Matthias - [Kanban Time Tracker](https://github.com/Matth-Ben)

## 🎯 Fonctionnalités actuelles (Sprint 1 + 2)

### Gestion de Projets

#### 4 Vues disponibles
- ✅ **📊 Vue Résumé** : Dashboard avec statistiques, progression, suivi temporel
- ✅ **📋 Vue Tableau** : Kanban visuel avec drag & drop
- ✅ **📝 Vue Liste** : Tableau détaillé avec 13 colonnes triables
- ✅ **⏱️ Vue Temps** : Suivi détaillé de toutes les sessions (style Clockify)

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

### Pour tester

#### Gestion de base
1. Démarrer le projet avec `npm run dev`
2. Aller sur http://localhost:3000/boards (maintenant "Projets")
3. Créer un projet avec le bouton "➕ Nouveau projet"
4. Choisir une vue : 📊 Résumé / 📋 Tableau / 📝 Liste / ⏱️ Temps

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

Voir [TEST_DATA.md](./TEST_DATA.md) et [INSTALLATION.md](./INSTALLATION.md) pour plus de détails.

---

**Note :** Sprint 1 & 2 terminés ! Le Kanban et le Time Tracking sont pleinement fonctionnels. Prochains sprints : Devis & coûts, puis Templates de projets.

