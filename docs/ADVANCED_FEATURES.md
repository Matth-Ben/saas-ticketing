# Fonctionnalités Avancées - Settings Module

Ce document décrit les trois fonctionnalités avancées ajoutées au module Settings :
1. **Authentification à deux facteurs (2FA) avec QR Code**
2. **Upload d'avatar avec stockage local**
3. **Export des données RGPD**

---

## 1. 🔐 Authentification à Deux Facteurs (2FA)

### Présentation

L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant un code temporaire en plus du mot de passe lors de la connexion.

### Technologies utilisées

- **Backend** : `speakeasy` (génération OTP), `qrcode` (génération QR code)
- **Frontend** : Affichage QR code, input de vérification

### Architecture Backend

#### Service 2FA (`backend/src/services/twoFactorService.ts`)

```typescript
// Génération du secret et du QR code
generateSecret(email: string)
generateQRCode(otpauthUrl: string)

// Vérification du code
verifyToken(secret: string, token: string)

// Génération de codes de récupération
generateBackupCodes(count: number)
```

#### Endpoints API

- `POST /api/settings/2fa` - Activer/désactiver la 2FA
  - Body: `{ enable: boolean }`
  - Retourne le QR code et les backup codes si `enable = true`

- `POST /api/settings/2fa/verify` - Vérifier le code d'activation
  - Body: `{ token: string }` (code à 6 chiffres)
  - Active définitivement la 2FA si le code est valide

### Flux d'activation

1. **Génération** : L'utilisateur clique sur "Activer la 2FA"
   - Le backend génère un secret unique
   - Un QR code est créé (compatible Google Authenticator, Authy, etc.)
   - 10 codes de récupération sont générés

2. **Vérification** : L'utilisateur scanne le QR code
   - Il entre le code à 6 chiffres de son app
   - Le backend vérifie le code avec `speakeasy.totp.verify()`
   - Si valide, la 2FA est activée (`twoFactorEnabled = true`)

3. **Sauvegarde** : L'utilisateur sauvegarde les backup codes
   - Ces codes permettent la récupération en cas de perte de l'app

### Interface Frontend

L'interface 2FA dans `SecuritySection.tsx` affiche :
- Toggle d'activation/désactivation
- QR code pour scanner avec l'application
- Liste des 10 codes de récupération
- Input pour vérifier le code à 6 chiffres

### TODO - Vérification au login

**Note** : La vérification 2FA au login n'est pas encore implémentée. Il faudra :

1. Modifier `authService.loginUser()` pour vérifier si `user.twoFactorEnabled === true`
2. Si oui, demander le code 2FA avant de retourner les tokens
3. Créer un endpoint `POST /api/auth/verify-2fa` pour valider le code
4. Créer une page intermédiaire `/auth/2fa` pour l'input du code

---

## 2. 📸 Upload d'Avatar

### Présentation

Permet aux utilisateurs d'uploader une photo de profil (avatar) stockée localement sur le serveur.

### Technologies utilisées

- **Backend** : `multer` (gestion des uploads)
- **Frontend** : FormData pour l'upload

### Architecture Backend

#### Configuration Multer (`backend/src/config/multer.ts`)

```typescript
// Stockage sur disque
storage: multer.diskStorage({
  destination: 'backend/uploads/avatars',
  filename: `${userId}-${timestamp}.ext`
})

// Filtres
- Types acceptés : JPEG, PNG, GIF, WebP
- Taille max : 5MB
```

#### Endpoints API

- `POST /api/settings/avatar` - Upload d'avatar
  - Multipart form avec champ `avatar`
  - Retourne l'URL de l'avatar : `/uploads/avatars/filename.jpg`

- `DELETE /api/settings/avatar` - Supprimer l'avatar
  - Supprime le fichier du disque
  - Met à jour le champ `avatar` de l'utilisateur à `null`

#### Serveur de fichiers statiques

```typescript
// backend/src/server.ts
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

Les avatars sont accessibles via : `http://localhost:4000/uploads/avatars/filename.jpg`

### Interface Frontend

L'interface d'upload dans `ProfileSection.tsx` affiche :
- Prévisualisation de l'avatar actuel (ou initiales si pas d'avatar)
- Bouton "Changer la photo" (input file masqué)
- Bouton "Supprimer" si un avatar existe
- Indicateur de chargement pendant l'upload
- Validation côté client (type et taille)

### Stockage

**Actuel** : Stockage local dans `backend/uploads/avatars/`

**Production** : Il est recommandé de migrer vers S3 ou un CDN :
- Meilleure performance
- Scalabilité
- Backup automatique
- URLs optimisées

---

## 3. 📦 Export des Données RGPD

### Présentation

Conformément au RGPD (Article 20 - Droit à la portabilité), les utilisateurs peuvent télécharger une copie complète de leurs données personnelles.

### Technologies utilisées

- **Backend** : Prisma avec `include` pour récupérer toutes les relations
- **Frontend** : Download automatique du fichier JSON

### Architecture Backend

#### Service Export (`backend/src/services/settingsService.ts`)

```typescript
async exportUserData(userId: string) {
  // Récupère toutes les données avec relations
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      settings: true,
      subscription: true,
      organization: true,
      analytics: true,
      projects: { include: { project: true } },
      createdProjects: { include: { members, tickets, invoices, documents } },
      createdTickets: { include: { assignees } },
      assignedTickets: { include: { ticket } },
      supportTickets: { include: { comments } },
      sessions: true,
    },
  });

  // Suppression des données sensibles
  const { password, twoFactorSecret, resetPasswordToken, ...userData } = user;

  return {
    exportDate: new Date().toISOString(),
    user: userData,
    notice: 'Données RGPD...',
  };
}
```

#### Endpoint API

- `GET /api/settings/export` - Télécharger les données
  - Retourne un fichier JSON
  - Headers : `Content-Disposition: attachment; filename="user-data-{userId}-{timestamp}.json"`

### Données exportées

L'export inclut :
- ✅ Informations de profil (nom, email, téléphone, etc.)
- ✅ Paramètres et préférences
- ✅ Abonnement et facturation
- ✅ Projets créés et participations
- ✅ Tickets créés et assignés
- ✅ Factures et devis
- ✅ Documents uploadés
- ✅ Tickets de support
- ✅ Sessions actives
- ✅ Statistiques d'utilisation

**Exclus** (données sensibles) :
- ❌ Mot de passe hashé
- ❌ Secret 2FA
- ❌ Token de réinitialisation

### Interface Frontend

L'interface d'export dans `ProfileSection.tsx` affiche :
- Description de l'export RGPD
- Liste des données incluses
- Bouton "Télécharger mes données (JSON)"
- Téléchargement automatique du fichier

### Format de l'export

```json
{
  "exportDate": "2025-11-09T21:30:00.000Z",
  "notice": "Cet export contient toutes vos données personnelles...",
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "freelance",
    "settings": { ... },
    "subscription": { ... },
    "projects": [ ... ],
    "createdProjects": [ ... ],
    "tickets": [ ... ],
    ...
  }
}
```

---

## 📁 Structure des Fichiers

### Backend

```
backend/
├── src/
│   ├── config/
│   │   └── multer.ts                    # Configuration Multer
│   ├── services/
│   │   ├── twoFactorService.ts          # Service 2FA
│   │   └── settingsService.ts           # Settings + Export RGPD
│   ├── controllers/
│   │   └── settingsController.ts        # Controllers settings
│   └── routes/
│       └── settings.ts                  # Routes settings
└── uploads/
    └── avatars/                         # Avatars uploadés
```

### Frontend

```
frontend/
└── components/
    └── settings/
        ├── ProfileSection.tsx           # Avatar upload + Export RGPD
        └── SecuritySection.tsx          # 2FA setup
```

---

## 🚀 Utilisation

### Activer la 2FA

1. Aller dans **Settings > Sécurité**
2. Cliquer sur **Activer** dans la section 2FA
3. Scanner le QR code avec Google Authenticator/Authy
4. Sauvegarder les codes de récupération
5. Entrer le code à 6 chiffres pour vérifier
6. ✅ 2FA activée !

### Uploader un avatar

1. Aller dans **Settings > Profil**
2. Cliquer sur **Changer la photo**
3. Sélectionner une image (JPG, PNG, GIF, WebP, max 5MB)
4. ✅ Avatar mis à jour !

### Exporter ses données

1. Aller dans **Settings > Profil**
2. Descendre jusqu'à la section **Mes données personnelles (RGPD)**
3. Cliquer sur **Télécharger mes données (JSON)**
4. ✅ Fichier JSON téléchargé !

---

## 🔧 Configuration

### Variables d'environnement

Aucune variable supplémentaire requise. Les fonctionnalités utilisent les configs existantes.

### Dépendances installées

```bash
# Backend
npm install speakeasy qrcode @types/qrcode @types/speakeasy multer @types/multer
```

---

## ⚠️ Limitations et TODO

### 2FA
- [ ] **Vérification au login** : Implémenter le flow complet avec page intermédiaire
- [ ] **Codes de récupération** : Stocker les backup codes hashés en BDD
- [ ] **Désactivation sécurisée** : Demander mot de passe + code 2FA

### Avatar
- [ ] **Migration S3** : Migrer le stockage vers AWS S3 ou équivalent
- [ ] **Resize** : Optimiser les images (compression, resize)
- [ ] **Validation avancée** : Vérifier que c'est bien une image valide

### Export RGPD
- [ ] **Format ZIP** : Permettre export en ZIP avec fichiers inclus
- [ ] **Planification** : Permettre export automatique mensuel
- [ ] **Suppression compte** : Intégrer export avant suppression

---

## 📊 Sécurité

### 2FA
- ✅ Secret unique par utilisateur
- ✅ Vérification avec window de 2 time steps (60 secondes)
- ✅ Codes de récupération générés
- ⚠️ Codes de récupération non hashés (TODO)

### Avatar
- ✅ Validation type MIME
- ✅ Limite de taille (5MB)
- ✅ Filename sécurisé (userId + timestamp)
- ✅ Suppression de l'ancien fichier lors de remplacement

### Export RGPD
- ✅ Exclusion des données sensibles (password, secrets)
- ✅ Authentification requise
- ✅ Export unique à l'utilisateur (pas d'accès croisé)
- ⚠️ Pas de rate limiting (TODO)

---

## 🧪 Tests

### Tests manuels recommandés

**2FA :**
1. Activer la 2FA
2. Scanner le QR code avec Google Authenticator
3. Vérifier le code
4. Désactiver la 2FA
5. Tester avec code invalide

**Avatar :**
1. Uploader une image valide
2. Vérifier l'affichage
3. Uploader une nouvelle image
4. Vérifier le remplacement
5. Supprimer l'avatar
6. Tester avec fichier invalide (PDF, > 5MB)

**Export RGPD :**
1. Cliquer sur exporter
2. Vérifier le téléchargement du JSON
3. Ouvrir le fichier et vérifier les données
4. Vérifier l'absence de données sensibles

---

## 📞 Support

Pour toute question ou problème :
- Consulter la documentation principale : `docs/SETTINGS_MODULE.md`
- Reporter un bug : GitHub Issues
