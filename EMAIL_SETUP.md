# Configuration de l'envoi d'emails

## Mode développement (par défaut)

En mode développement, **aucune configuration SMTP n'est requise**. Le système va simplement afficher les liens de réinitialisation de mot de passe dans les logs du backend.

Pour voir les liens de réinitialisation :

```bash
docker-compose logs backend -f
```

Lorsqu'un utilisateur demande une réinitialisation de mot de passe, vous verrez dans les logs :

```
SMTP not configured. Password reset link: http://localhost:3000/auth/reset-password?token=abc123...
Email would be sent to: user@example.com
```

## Configuration SMTP pour production

### Option 1 : Gmail (recommandé pour les tests)

#### Étape 1 : Créer un mot de passe d'application Gmail

1. Allez sur votre compte Google : https://myaccount.google.com
2. **Sécurité** → **Validation en deux étapes** (activez-la si ce n'est pas déjà fait)
3. **Sécurité** → **Mots de passe des applications**
4. Sélectionnez **"Autre (nom personnalisé)"**
5. Entrez : `SaaS Ticketing`
6. Cliquez sur **"Générer"**
7. **Copiez le mot de passe** (16 caractères sans espaces)

#### Étape 2 : Configurer le `.env`

Ouvrez `D:\Projets\Perso\saas-ticketing\.env` et remplissez :

```env
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # Le mot de passe d'application généré (enlevez les espaces)
SMTP_FROM=votre.email@gmail.com
APP_NAME=SaaS Ticketing
```

#### Étape 3 : Redémarrer le backend

```bash
docker-compose restart backend
```

### Option 2 : Autres services SMTP

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=votre_api_key_sendgrid
SMTP_FROM=noreply@votredomaine.com
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votredomaine.mailgun.org
SMTP_PASSWORD=votre_password_mailgun
SMTP_FROM=noreply@votredomaine.com
```

#### SMTP personnalisé

```env
SMTP_HOST=smtp.votreserveur.com
SMTP_PORT=587  # ou 465 si SSL
SMTP_SECURE=false  # true si port 465
SMTP_USER=votre_utilisateur
SMTP_PASSWORD=votre_mot_de_passe
SMTP_FROM=noreply@votredomaine.com
```

## Test de la fonctionnalité

### 1. Sans SMTP configuré (mode développement)

1. Allez sur : http://localhost:3000/auth/login
2. Cliquez sur **"Mot de passe oublié ?"**
3. Entrez votre email et cliquez sur **"Envoyer le lien de réinitialisation"**
4. Dans les logs backend, **copiez le lien de réinitialisation**
5. Ouvrez le lien dans votre navigateur
6. Définissez un nouveau mot de passe

### 2. Avec SMTP configuré (production)

1. Allez sur : http://localhost:3000/auth/login
2. Cliquez sur **"Mot de passe oublié ?"**
3. Entrez votre email
4. **Vérifiez votre boîte email** (ou spam)
5. Cliquez sur le lien dans l'email
6. Définissez un nouveau mot de passe

## Flux technique

```
┌─────────────────┐
│   User submits  │
│   forgot-pwd    │
│   form          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /api/     │
│  auth/forgot-   │
│  password       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  1. Find user by email       │
│  2. Generate reset token     │
│  3. Hash token & save to DB  │
│  4. Set expiry (1 hour)      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Send email with token       │
│  (or log to console if dev)  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User clicks link in email   │
│  /reset-password?token=xxx   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/auth/             │
│  reset-password              │
│  { token, password }         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  1. Find user with token     │
│  2. Verify token & expiry    │
│  3. Hash new password        │
│  4. Update user              │
│  5. Clear reset token        │
└─────────────────────────────┘
```

## Sécurité

### Bonnes pratiques implémentées

✅ **Token hashé** : Le token est hashé avec bcrypt avant d'être stocké en base
✅ **Expiration** : Le token expire après 1 heure
✅ **Pas de révélation** : L'API ne révèle jamais si un email existe ou non
✅ **Token unique** : Chaque demande génère un nouveau token
✅ **Clear après usage** : Le token est supprimé après réinitialisation
✅ **Validation mot de passe** : Minimum 8 caractères requis

### Personnalisation de l'email

Pour modifier le template d'email, éditez :
`backend/src/services/emailService.ts`

L'email contient :
- Un design responsive
- Un bouton principal cliquable
- Le lien complet en texte (au cas où le bouton ne fonctionne pas)
- Une version texte brut (pour les clients email sans HTML)

## Dépannage

### Les emails arrivent en spam

- Configurez SPF, DKIM et DMARC sur votre domaine
- Utilisez un service SMTP réputé (SendGrid, Mailgun)
- Ajoutez un nom d'expéditeur reconnaissable

### Erreur "Error sending password reset email"

1. Vérifiez vos identifiants SMTP dans le `.env`
2. Vérifiez que le port est correct (587 ou 465)
3. Vérifiez les logs backend : `docker-compose logs backend`
4. Testez la connexion SMTP avec un outil comme `telnet`

### Le lien de réinitialisation ne fonctionne pas

1. Vérifiez que le token n'a pas expiré (1 heure max)
2. Vérifiez que `CORS_ORIGIN` dans le `.env` correspond à votre frontend
3. Vérifiez que le backend est bien démarré

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` (TLS) ou `465` (SSL) |
| `SMTP_SECURE` | Utiliser SSL | `false` pour 587, `true` pour 465 |
| `SMTP_USER` | Utilisateur SMTP | `votre@email.com` |
| `SMTP_PASSWORD` | Mot de passe SMTP | Mot de passe d'application |
| `SMTP_FROM` | Email expéditeur | `noreply@votreapp.com` |
| `APP_NAME` | Nom de l'application | `SaaS Ticketing` |

## Pour aller plus loin

- **Email de bienvenue** : Implémentez `sendWelcomeEmail` dans `emailService.ts`
- **Vérification d'email** : Implémentez `sendEmailVerification`
- **Templates avancés** : Utilisez un service comme Handlebars ou MJML
- **File d'attente** : Utilisez Bull/BullMQ pour envoyer les emails de manière asynchrone
