# 🔐 Configuration Google OAuth - Guide Complet

## ✅ Ce qui a été implémenté

### 1. **Liaison automatique de compte par email**

Lorsqu'un utilisateur se connecte avec Google, le système :

1. **Vérifie si un compte Google existe** (par `googleId`)
   - Si oui → Connexion directe

2. **Vérifie si un compte avec cet email existe** (liaison automatique)
   - Si oui → Lie le compte Google au compte existant
   - Met à jour : `googleId`, `emailVerified: true`, `avatar`, `firstName`, `lastName`

3. **Crée un nouveau compte** si aucun compte n'existe
   - Avec les informations Google (email, nom, photo)

### 2. **Authentification multi-méthode**

Un utilisateur peut maintenant :
- ✅ S'inscrire avec **email/password**
- ✅ S'inscrire avec **Google OAuth**
- ✅ Se connecter avec **email/password** OU **Google** (sur le même compte après liaison)

### 3. **Flux OAuth implémenté**

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend    │────────▶│   Google    │
│             │  Click  │              │  OAuth  │   OAuth     │
└─────────────┘         └──────────────┘         └─────────────┘
       ▲                        │                        │
       │                        │                        │
       │        JWT tokens      │      User info         │
       └────────────────────────┴────────────────────────┘
                     Redirect to /auth/callback
```

## 🛠️ Configuration Google OAuth

### Étape 1 : Créer un projet Google Cloud

1. Aller sur : https://console.cloud.google.com
2. Cliquer sur **"Sélectionner un projet"** → **"Nouveau projet"**
3. Nom du projet : `SaaS Ticketing` (ou autre)
4. Cliquer sur **"Créer"**

### Étape 2 : Activer Google+ API

1. Dans le menu de gauche : **APIs et services** → **Bibliothèque**
2. Rechercher : `Google+ API`
3. Cliquer sur **"Activer"**

### Étape 3 : Configurer l'écran de consentement OAuth

1. Menu : **APIs et services** → **Écran de consentement OAuth**
2. Choisir **"Externe"** (pour tester avec n'importe quel compte Google)
3. Remplir les informations :
   - **Nom de l'application** : `SaaS Ticketing`
   - **Email assistance utilisateur** : votre email
   - **Domaine de l'application** : (laisser vide pour dev)
   - **Email développeur** : votre email
4. **Enregistrer et continuer**
5. **Champs d'application** : Cliquer sur **"Ajouter ou supprimer des champs"**
   - Cocher : `email`, `profile`, `openid`
6. **Enregistrer et continuer**
7. **Utilisateurs test** (pour mode développement) :
   - Ajouter votre email Gmail
   - Cliquer sur **"Enregistrer et continuer"**

### Étape 4 : Créer les identifiants OAuth 2.0

1. Menu : **APIs et services** → **Identifiants**
2. Cliquer sur **"Créer des identifiants"** → **"ID client OAuth"**
3. Type d'application : **"Application Web"**
4. Nom : `SaaS Ticketing - Web Client`
5. **Origines JavaScript autorisées** :
   ```
   http://localhost:3000
   ```
6. **URI de redirection autorisés** :
   ```
   http://localhost:4000/api/auth/google/callback
   ```
7. Cliquer sur **"Créer"**

### Étape 5 : Copier les clés

Vous verrez une popup avec :
- **ID client** : `123456789-xxxxx.apps.googleusercontent.com`
- **Code secret du client** : `GOCSPX-xxxxx`

**⚠️ IMPORTANT** : Copiez ces valeurs !

### Étape 6 : Configurer le `.env`

Ouvrez `D:\Projets\Perso\saas-ticketing\.env` et remplacez :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-votre-client-secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
```

### Étape 7 : Redémarrer le backend

```bash
docker-compose restart backend
```

## 🎯 Test de l'authentification

### Test 1 : Inscription avec email/password puis connexion Google

1. **Inscrivez-vous** via : http://localhost:3000/auth/register
   - Email : `test@gmail.com`
   - Mot de passe : `password123`
   - ✅ Compte créé avec password

2. **Déconnectez-vous**

3. **Cliquez sur "Google"** : http://localhost:3000/auth/login
   - Sélectionnez le compte Gmail `test@gmail.com`
   - ✅ **Le compte est automatiquement lié !**
   - Vous êtes connecté au même compte

### Test 2 : Connexion Google directe (nouveau compte)

1. **Cliquez sur "Google"** : http://localhost:3000/auth/login
   - Utilisez un email Gmail **différent** : `autre@gmail.com`
   - ✅ **Nouveau compte créé avec Google**
   - Pas de mot de passe enregistré

2. **Essayez de vous connecter avec email/password**
   - ❌ Échec (pas de mot de passe)
   - Mais vous pouvez toujours vous connecter avec Google !

### Test 3 : Liaison de compte après inscription Google

1. **Créez un compte via email/password**
   - Email : `nouveau@gmail.com`
   - Mot de passe : `password123`

2. **Connectez-vous avec Google** (même email)
   - ✅ **Compte lié automatiquement**

3. **Maintenant vous pouvez vous connecter avec les deux méthodes !**
   - ✅ Email + password
   - ✅ Google OAuth

## 🔍 Vérification dans la base de données

Pour voir si un compte est lié :

```bash
docker-compose exec backend npx prisma studio
```

Ouvrir : http://localhost:5555

Regardez la table **User** :
- `password` : Hash du mot de passe (si inscription email)
- `googleId` : ID Google (si connexion Google)
- `emailVerified` : `true` si authentifié via Google

**Exemples** :

| Email | password | googleId | Méthode de connexion |
|-------|----------|----------|---------------------|
| user1@gmail.com | `$2a$10...` | `null` | ✅ Email/password uniquement |
| user2@gmail.com | `null` | `123456` | ✅ Google uniquement |
| user3@gmail.com | `$2a$10...` | `123456` | ✅ Les deux méthodes ! |

## 🚀 Flux technique

### Connexion classique (email/password)

```
Frontend → POST /api/auth/login
{
  email: "user@example.com",
  password: "password123"
}

Backend → Vérifie password → Génère JWT → Retourne tokens
Frontend → Stocke tokens → Redirection /dashboard
```

### Connexion Google OAuth

```
1. Frontend → Click "Google"
   → Redirection : http://localhost:4000/api/auth/google

2. Backend → Redirection vers Google
   → URL Google OAuth avec client_id, scope, redirect_uri

3. Google → User authentifie
   → Retourne vers : http://localhost:4000/api/auth/google/callback?code=...

4. Backend →
   a) Échange code contre tokens Google
   b) Récupère infos user (email, nom, photo)
   c) Cherche/Crée/Lie le compte dans la DB
   d) Génère JWT tokens
   → Redirection : http://localhost:3000/auth/callback?accessToken=...&refreshToken=...

5. Frontend (page /auth/callback) →
   a) Récupère tokens depuis URL
   b) Stocke dans localStorage
   c) Décode JWT pour obtenir user info
   → Redirection : /dashboard
```

## 📁 Fichiers créés/modifiés

### Backend

- ✅ `backend/src/config/passport.ts` - Configuration Passport Google Strategy
- ✅ `backend/src/controllers/authController.ts` - Controllers OAuth
- ✅ `backend/src/routes/auth.ts` - Routes `/google` et `/google/callback`
- ✅ `backend/src/server.ts` - Initialisation Passport

### Frontend

- ✅ `frontend/app/auth/callback/page.tsx` - Page de traitement OAuth
- ✅ `frontend/app/auth/login/page.tsx` - Bouton Google mis à jour
- ✅ `frontend/app/auth/register/page.tsx` - Bouton Google mis à jour

## ⚠️ Important pour la production

1. **Changer les URLs** dans `.env` :
   ```env
   CORS_ORIGIN=https://votre-domaine.com
   GOOGLE_REDIRECT_URI=https://api.votre-domaine.com/api/auth/google/callback
   ```

2. **Mettre à jour Google Cloud Console** :
   - Origines autorisées : `https://votre-domaine.com`
   - URI de redirection : `https://api.votre-domaine.com/api/auth/google/callback`

3. **Passer en mode Production** sur l'écran de consentement OAuth

4. **Sécuriser les secrets** :
   - Ne jamais commiter `.env`
   - Utiliser des variables d'environnement sécurisées

## 🎉 C'est prêt !

Votre système d'authentification supporte maintenant :
- ✅ Inscription/Connexion classique (email/password)
- ✅ Inscription/Connexion Google OAuth
- ✅ Liaison automatique de comptes par email
- ✅ Multi-authentification (les deux méthodes sur un même compte)

**Testez dès maintenant en configurant Google OAuth !** 🚀
