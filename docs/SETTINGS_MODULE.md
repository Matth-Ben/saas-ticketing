# Module Account & Settings - Documentation

## Vue d'ensemble

Le module Account & Settings permet aux utilisateurs de gérer leurs informations personnelles, préférences, sécurité, notifications, modules activés, facturation et paramètres d'organisation selon leur rôle.

## Structure

### Backend

#### Modèles Prisma

**UserSettings** (`backend/prisma/schema.prisma`)
- Préférences utilisateur (langue, fuseau horaire, thème)
- Activation des modules (devis, timeline, drive, etc.)
- Préférences de notification
- Mode d'affichage de facturation

**UserSession** (`backend/prisma/schema.prisma`)
- Gestion des sessions actives
- Informations appareil/navigateur
- Adresse IP et user agent
- Dates de connexion et dernière activité

**OrganizationSettings** (`backend/prisma/schema.prisma`)
- Branding (logo, couleur principale)
- Politiques de sécurité (2FA obligatoire, mots de passe forts)
- Modules d'organisation

#### API Endpoints

Tous les endpoints sont protégés par authentication (`/api/settings/*`)

- `GET /api/settings` - Récupérer les paramètres utilisateur
- `PUT /api/settings/profile` - Mettre à jour le profil
- `PUT /api/settings/preferences` - Mettre à jour les préférences
- `PUT /api/settings/password` - Changer le mot de passe
- `POST /api/settings/2fa` - Activer/désactiver la 2FA
- `GET /api/settings/sessions` - Lister les sessions actives
- `DELETE /api/settings/sessions` - Révoquer toutes les sessions
- `PUT /api/settings/notifications` - Mettre à jour les notifications
- `PUT /api/settings/features` - Activer/désactiver les modules
- `DELETE /api/settings/account` - Supprimer le compte
- `GET /api/settings/organization` - Récupérer les paramètres d'organisation
- `PUT /api/settings/organization` - Mettre à jour l'organisation

#### Fichiers Backend

- `backend/src/controllers/settingsController.ts` - Contrôleur des settings
- `backend/src/services/settingsService.ts` - Logique métier
- `backend/src/routes/settings.ts` - Routes API

### Frontend

#### Page principale

`frontend/app/settings/page.tsx` - Page avec navigation par onglets

#### Sections (Components)

- `ProfileSection.tsx` - Informations personnelles et préférences
- `SecuritySection.tsx` - Mot de passe, 2FA, sessions
- `NotificationsSection.tsx` - Préférences de notifications
- `FeaturesSection.tsx` - Activation/désactivation des modules
- `BillingSection.tsx` - Gestion de l'abonnement (Stripe Portal)
- `OrganizationSection.tsx` - Paramètres d'organisation (Agence/Entreprise)
- `IntegrationsSection.tsx` - Intégrations externes (Entreprise uniquement)

## Fonctionnalités par rôle

### Freelance
- ✅ Profile
- ✅ Security
- ✅ Notifications
- ✅ Features (limité)
- ✅ Billing
- ❌ Organization
- ❌ Integrations

Modules disponibles:
- Devis & Factures
- Time Tracking
- Lien Client
- Drive

### Agence
- ✅ Profile
- ✅ Security
- ✅ Notifications
- ✅ Features
- ✅ Billing
- ✅ Organization
- ❌ Integrations

Modules disponibles:
- Tous les modules Freelance
- Timeline

### Entreprise
- ✅ Toutes les sections

Modules disponibles:
- Tous les modules
- Analytics
- Intégrations

## Gestion des modules

Les modules sont gérés dans la section **Features**. Chaque module peut être activé/désactivé selon :
- Le rôle de l'utilisateur
- Le plan d'abonnement (via Stripe)

### Restrictions

- **Timeline** : Disponible uniquement pour Agence et Entreprise
- **Analytics** : Disponible uniquement pour Entreprise
- **Intégrations** : Disponible uniquement pour Entreprise

Si un utilisateur tente d'activer un module non disponible pour son rôle, l'API retourne une erreur 403.

## Sécurité

### Authentification

Tous les endpoints nécessitent un token JWT valide via le header `Authorization: Bearer <token>`.

### Validation

- Changement de mot de passe : vérification du mot de passe actuel
- Suppression de compte : confirmation par mot de passe
- 2FA : génération de secret (TODO: intégration avec speakeasy)

### Sessions

Les sessions actives sont trackées avec :
- Appareil et navigateur
- Adresse IP
- Date de connexion et dernière activité
- Possibilité de révoquer toutes les sessions

## Notifications

Les utilisateurs peuvent configurer leurs préférences de notification pour :

**Canaux :**
- Email
- In-app
- Push (notifications navigateur)

**Événements :**
- Assignation de ticket
- Commentaires et mentions
- Changement de statut
- Factures et devis
- Échec de paiement
- Résumé hebdomadaire

## Intégration Stripe

La section Billing utilise le **Stripe Customer Portal** pour :
- Gérer l'abonnement
- Mettre à jour le moyen de paiement
- Télécharger les factures
- Voir l'historique des paiements

## Migration de la base de données

Pour appliquer les changements Prisma :

```bash
cd backend
npx prisma migrate dev --name add_user_settings_and_sessions
npx prisma generate
```

## Configuration

### Variables d'environnement

**Frontend** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`.env`)
```
DATABASE_URL=postgresql://user:password@db:5432/saas_ticketing
```

## Accès à la page Settings

Depuis le dashboard, un bouton "Paramètres" dans le header permet d'accéder à `/settings`.

## TODO / Améliorations futures

- [ ] Implémenter la vraie 2FA avec QR code (speakeasy + qrcode)
- [ ] Upload d'avatar avec stockage S3
- [ ] Webhook management pour plan Entreprise
- [ ] Intégrations réelles (Slack, GitHub, Notion)
- [ ] Génération de clés API
- [ ] Export des données utilisateur (RGPD)
- [ ] Historique des changements de settings
- [ ] Notifications in-app en temps réel (WebSocket)

## Test

Pour tester le module :

1. Se connecter avec un utilisateur
2. Accéder à `/settings` depuis le dashboard
3. Tester chaque section selon le rôle de l'utilisateur
4. Vérifier les restrictions par rôle

### Scénarios de test

**Freelance :**
- Doit voir : Profile, Security, Notifications, Features, Billing
- Ne doit pas voir : Organization, Integrations
- Ne peut pas activer : Timeline, Analytics

**Agence :**
- Doit voir : Profile, Security, Notifications, Features, Billing, Organization
- Ne doit pas voir : Integrations
- Ne peut pas activer : Analytics

**Entreprise :**
- Doit voir toutes les sections
- Peut activer tous les modules
