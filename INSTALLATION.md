# 📦 Guide d'installation - Kanban Time Tracker

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js et npm**
   ```bash
   sudo apt install npm
   ```

2. **PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

## Installation automatique

### Option 1 : Script d'installation
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2 : Installation manuelle

#### 1. Installer les dépendances

```bash
# À la racine du projet
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

#### 2. Configurer les variables d'environnement

```bash
# Backend
cp backend/env.example backend/.env

# Frontend
cp frontend/env.example frontend/.env
```

#### 3. Éditer les fichiers .env

**backend/.env** - Modifiez les paramètres PostgreSQL :
```env
PORT=5000
NODE_ENV=development

DB_NAME=kanban_time_tracker
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=changez-cette-cle-secrete-en-production
JWT_EXPIRES_IN=7d
```

**frontend/.env** - (optionnel, valeurs par défaut fournies)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Kanban Time Tracker
```

## Configuration de PostgreSQL

### Option 1 : Avec Docker (Recommandé pour le développement)

Le projet inclut un fichier `docker-compose.yml` pour démarrer PostgreSQL facilement :

```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d

# Vérifier que PostgreSQL fonctionne
docker-compose ps

# Voir les logs
docker-compose logs postgres

# Arrêter PostgreSQL
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v
```

Configuration par défaut (déjà dans `backend/.env`) :
- DB_NAME: `kanban_time_tracker`
- DB_USER: `postgres`
- DB_PASSWORD: `postgres`
- DB_HOST: `localhost`
- DB_PORT: `5434` (port modifié pour éviter les conflits avec PostgreSQL local)

### Option 2 : Installation locale de PostgreSQL

#### 1. Installer PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib
```

#### 2. Démarrer PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3. Créer un utilisateur et une base de données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL
CREATE USER votre_user WITH PASSWORD 'votre_password';
CREATE DATABASE kanban_time_tracker;
GRANT ALL PRIVILEGES ON DATABASE kanban_time_tracker TO votre_user;
\q
```

#### 4. Tester la connexion
```bash
psql -U votre_user -d kanban_time_tracker -h localhost
```

## Démarrage du projet

### Démarrer frontend et backend simultanément
```bash
npm run dev
```

Le projet sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000/api
- Health check : http://localhost:5000/health

### Démarrer séparément

**Frontend uniquement :**
```bash
npm run dev:frontend
# ou
cd frontend && npm run dev
```

**Backend uniquement :**
```bash
npm run dev:backend
# ou
cd backend && npm run dev
```

## Vérification de l'installation

### 1. Vérifier le backend
```bash
curl http://localhost:5000/health
# Devrait retourner : {"status":"ok","message":"Kanban Time Tracker API is running"}

curl http://localhost:5000/api/test
# Devrait retourner : {"message":"API fonctionne correctement !"}
```

### 2. Vérifier le frontend
Ouvrez http://localhost:3000 dans votre navigateur. Vous devriez voir le tableau de bord avec :
- Un bouton de changement de thème (clair/sombre)
- Des cartes affichant les statistiques (0 projets, 0 tâches, 0h)
- Un message de bienvenue

## Problèmes courants

### "npm: command not found"
```bash
sudo apt update
sudo apt install npm
```

### "Cannot connect to database"
- Vérifiez que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifiez vos credentials dans `backend/.env`
- Testez la connexion manuellement : `psql -U votre_user -d kanban_time_tracker`

### "Port already in use"
Si les ports 3000 ou 5000 sont déjà utilisés :

**Frontend** - Modifiez dans `frontend/vite.config.ts` :
```ts
server: {
  port: 3001, // Changez le port
}
```

**Backend** - Modifiez dans `backend/.env` :
```env
PORT=5001
```

### Erreurs TypeScript/ESLint
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint
```

## Scripts disponibles

### Racine du projet
- `npm run dev` - Démarre frontend et backend
- `npm run dev:frontend` - Démarre uniquement le frontend
- `npm run dev:backend` - Démarre uniquement le backend

### Frontend (dans `/frontend`)
- `npm run dev` - Mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Vérifier le code
- `npm run format` - Formater le code

### Backend (dans `/backend`)
- `npm run dev` - Mode développement avec hot reload
- `npm run build` - Compiler TypeScript
- `npm run start` - Démarrer en production
- `npm run lint` - Vérifier le code
- `npm run format` - Formater le code

## Prochaines étapes

Une fois l'installation terminée, vous pouvez :
1. Explorer le tableau de bord sur http://localhost:3000
2. Tester le changement de thème clair/sombre
3. Consulter la documentation dans `/docs`
4. Passer au Sprint 1 pour développer le Kanban

## Support

Pour toute question ou problème :
1. Consultez la documentation dans `/docs/CONTEXT_README.md`
2. Vérifiez les logs du serveur backend
3. Consultez les logs du navigateur (F12)

