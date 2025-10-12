# 📊 Sprint 2 - Time Tracker & Rapports

Documentation complète du système de suivi du temps implémenté dans le Sprint 2.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Composants](#composants)
- [API Backend](#api-backend)
- [Flux de données](#flux-de-données)
- [Guide d'utilisation](#guide-dutilisation)
- [Exemples](#exemples)

## 🎯 Vue d'ensemble

Le Sprint 2 ajoute un système complet de suivi du temps (Time Tracking) au projet, permettant :
- ⏱️ Enregistrement précis du temps passé sur chaque tâche
- 📊 Visualisation et analyse des données temporelles
- 📈 Rapports détaillés avec graphiques
- 💾 Export des données en CSV
- ✏️ Édition complète des entrées de temps

### Inspirations

Le système s'inspire des meilleures pratiques de :
- **Clockify** : Interface de suivi du temps
- **Toggl** : Simplicité du timer
- **Jira** : Intégration aux cartes

## 🏗️ Architecture

### Stack technique

**Backend :**
```
TimeEntry (Model)
    ↓
timeController (CRUD + Reports)
    ↓
timeRoutes (/api/time/*)
```

**Frontend :**
```
TimeTracker (Component)
    ↓
timeService (API calls)
    ↓
TimeTrackerView (Liste)
    ↓
TimeEntryModal (Édition)
```

### Modèle de données

```typescript
interface TimeEntry {
  id: string                    // UUID
  cardId: string               // Référence à la carte
  userId?: string              // Utilisateur (pour plus tard)
  startTime: Date              // Début de session
  endTime?: Date               // Fin de session
  duration?: number            // Durée en minutes
  description?: string         // Description du travail
  isPaused: boolean           // État pause
  pausedAt?: Date             // Heure de la pause
  totalPauseDuration: number  // Durée totale des pauses (min)
  createdAt: Date
  updatedAt: Date
}
```

## ✨ Fonctionnalités

### 1. Timer intégré aux cartes

#### Mode compact (CardItem)
```
┌─────────────────────────────┐
│ Tâche #PROJ-123            │
│                             │
│ ⏱️ 1h 23m  ⏸️  ⏹️          │
└─────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Bouton Start/Stop compact
- ✅ Affichage du temps en cours
- ✅ Boutons Pause/Resume
- ✅ Clic direct sans ouvrir le modal

#### Mode détaillé (CardModal)
```
┌─────────────────────────────────┐
│ ⏱️ Suivi du temps    02:30:15   │
├─────────────────────────────────┤
│ [▶️ Démarrer]                   │
│                                 │
│ Statut: ▶️ En cours             │
│ Débuté à: 14:23:45              │
│ Temps de pause: 15m             │
└─────────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Timer HH:MM:SS en temps réel
- ✅ Statut détaillé (En cours, En pause)
- ✅ Information sur les pauses
- ✅ Boutons Start, Pause, Resume, Stop

### 2. Calcul automatique du temps

#### Temps réel dans les détails
```
Temps réel (heures)
┌─────────────────────────┐
│ 2.5h          2h 30m    │
└─────────────────────────┘
📊 3 sessions enregistrées

Sessions enregistrées (3)
┌─────────────────────────┐
│ 1h 15m                  │
│ 12/10/2025 à 14:30      │
├─────────────────────────┤
│ 45m                     │
│ 12/10/2025 à 16:00      │
├─────────────────────────┤
│ 30m                     │
│ 12/10/2025 à 17:30      │
└─────────────────────────┘
```

**Caractéristiques :**
- ✅ Calcul depuis toutes les TimeEntries
- ✅ Liste de toutes les sessions
- ✅ Temps total affiché en heures et format lisible
- ✅ Non-éditable manuellement (lecture seule)

### 3. Vue Temps (TimeTracker)

Interface complète de type Clockify pour gérer toutes les sessions.

```
┌──────────────────────────────────────────────────────┐
│ ⏱️ Suivi du temps       [Date] [Carte] [Réinitialiser]│
│ 42 sessions · 120h 30m                               │
├──────────────────────────────────────────────────────┤
│ Vendredi 12 octobre 2025              18h 30m (5 sess)│
├────────┬─────────┬──────┬─────┬───────┬──────────────┤
│ Carte  │Descrip. │Début │Fin  │Durée  │Actions       │
├────────┼─────────┼──────┼─────┼───────┼──────────────┤
│PROJ-1  │Dev API  │14:30 │16:45│2h 15m │✏️ Éditer      │
│PROJ-2  │Design   │10:00 │12:30│2h 30m │✏️ Éditer      │
└────────┴─────────┴──────┴─────┴───────┴──────────────┘
```

**Fonctionnalités :**
- ✅ Groupement par jour avec totaux
- ✅ Filtres par date et par carte
- ✅ Lien vers la carte (cliquable)
- ✅ Édition au clic
- ✅ Format de date localisé (français)
- ✅ Durées formatées (2h 15m)

### 4. Modal d'édition

```
┌──────────────────────────────────┐
│ Éditer l'entrée de temps    [×] │
│ PROJ-1 - Développer l'API        │
├──────────────────────────────────┤
│ Description:                     │
│ ┌──────────────────────────────┐ │
│ │ Développement de l'API...   │ │
│ └──────────────────────────────┘ │
│                                  │
│ Heure de début:  Heure de fin:  │
│ [14:30]         [16:45]          │
│                                  │
│ Durée: [135] = 2h 15m            │
│                                  │
│ ℹ️ Cette session contient 15m   │
│    de pause                      │
├──────────────────────────────────┤
│ [🗑️ Supprimer]  [Annuler] [✓]   │
└──────────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Édition de la description
- ✅ Modification des heures début/fin
- ✅ Calcul automatique de la durée
- ✅ Édition manuelle de la durée
- ✅ Affichage des pauses
- ✅ Suppression possible

### 5. Page Rapports

Interface d'analyse avec graphiques et statistiques.

```
┌────────────────────────────────────┐
│ 📊 Rapports de temps  [📥 CSV]    │
├────────────────────────────────────┤
│ Filtres: [Projet] [Dates] [Groupe]│
├────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐           │
│ │120h │ │ 45  │ │160m │           │
│ │Total│ │Sess.│ │Moy. │           │
│ └─────┘ └─────┘ └─────┘           │
├────────────────────────────────────┤
│ [Graphique à barres]               │
│ [Graphique circulaire]             │
├────────────────────────────────────┤
│ [Tableau détaillé]                 │
└────────────────────────────────────┘
```

**Graphiques :**
- ✅ **Barres** : Temps par carte/jour/projet
- ✅ **Circulaire** : Répartition du Top 6
- ✅ **Responsive** : Recharts

**Filtres :**
- ✅ Par projet
- ✅ Par période (date début/fin)
- ✅ Groupement (carte, jour, projet)

**Export :**
- ✅ CSV complet
- ✅ Format Excel compatible

### 6. Vue Résumé enrichie

Le dashboard du projet intègre maintenant les données de temps.

```
┌───────────────────────────────────┐
│ ⏱️ Suivi temporel                 │
├───────────────────────────────────┤
│ Estimé  Passé   Sessions  Écart  │
│  25h    18.5h     42      -6.5h  │
│        18h 30m          74% ✅    │
├───────────────────────────────────┤
│ Progression temporelle            │
│ ████████████████░░░░░░░░░ 74%    │
├───────────────────────────────────┤
│ Top 5 - Cartes par temps passé   │
│ PROJ-1  Dev API      3h 45m      │
│ PROJ-2  Design UI    2h 30m      │
│ PROJ-5  Tests        1h 45m      │
└───────────────────────────────────┘
```

**Indicateurs :**
- ✅ Temps estimé total
- ✅ Temps passé (calculé depuis TimeEntries)
- ✅ Nombre de sessions
- ✅ Écart avec code couleur
- ✅ Barre de progression
- ✅ Top 5 des cartes

## 🔧 Composants

### Frontend

#### 1. `TimeTracker.tsx`

Composant principal du timer.

**Props :**
```typescript
interface TimeTrackerProps {
  cardId: string
  compact?: boolean
  onTimeUpdate?: () => void
}
```

**États :**
```typescript
const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
const [elapsed, setElapsed] = useState<number>(0) // en secondes
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Méthodes :**
- `loadActiveEntry()` : Charge la session active
- `handleStart()` : Démarre une nouvelle session
- `handlePause()` : Met en pause
- `handleResume()` : Reprend après pause
- `handleStop()` : Arrête et sauvegarde
- `formatTime(seconds)` : Formate en HH:MM:SS

#### 2. `TimeTrackerView.tsx`

Vue complète de toutes les sessions.

**Props :**
```typescript
interface TimeTrackerViewProps {
  board: Board
  onEditCard?: (card: Card) => void
}
```

**États :**
```typescript
const [entries, setEntries] = useState<TimeEntryWithCard[]>([])
const [cards, setCards] = useState<Card[]>([])
const [selectedEntry, setSelectedEntry] = useState<TimeEntryWithCard | null>(null)
const [filterDate, setFilterDate] = useState<string>('')
const [filterCard, setFilterCard] = useState<string>('')
```

**Fonctionnalités :**
- Chargement de toutes les TimeEntries
- Filtrage par date et carte
- Groupement par jour
- Calcul des totaux
- Ouverture du modal d'édition

#### 3. `TimeEntryModal.tsx`

Modal d'édition d'une entrée de temps.

**Props :**
```typescript
interface TimeEntryModalProps {
  entry: TimeEntry
  card?: Card
  onSave: () => void
  onClose: () => void
  onDelete?: (id: string) => void
}
```

**Fonctionnalités :**
- Édition de tous les champs
- Calcul automatique de la durée
- Validation
- Suppression avec confirmation

#### 4. `DetailsPanel.tsx` (modifié)

Panel de détails enrichi avec le temps réel.

**Nouveautés :**
```typescript
const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
const [totalTimeMinutes, setTotalTimeMinutes] = useState<number>(0)

useEffect(() => {
  if (cardId) loadTimeEntries()
}, [cardId])
```

**Affichage :**
- Temps réel calculé automatiquement
- Liste des sessions
- Indicateur de dépassement

#### 5. `SummaryView.tsx` (modifié)

Vue résumé avec statistiques de temps.

**Nouveautés :**
```typescript
const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

useEffect(() => {
  loadAllTimeEntries()
}, [board.id, cards])
```

**Calculs :**
- Temps total du projet
- Nombre de sessions
- Top 5 des cartes
- Barre de progression

#### 6. `Reports.tsx`

Page complète de rapports.

**Fonctionnalités :**
- Filtres dynamiques
- Graphiques Recharts
- Export CSV
- Tableau détaillé

### Backend

#### 1. `TimeEntry.ts` (Model)

Modèle Sequelize pour les entrées de temps.

**Champs :**
```typescript
{
  id: UUID,
  cardId: UUID (FK → cards),
  userId: STRING (optionnel),
  startTime: DATE,
  endTime: DATE (nullable),
  duration: INTEGER (minutes),
  description: TEXT (nullable),
  isPaused: BOOLEAN,
  pausedAt: DATE (nullable),
  totalPauseDuration: INTEGER (minutes)
}
```

**Relations :**
```typescript
Card.hasMany(TimeEntry, { foreignKey: 'cardId', as: 'timeEntries' })
TimeEntry.belongsTo(Card, { foreignKey: 'cardId', as: 'card' })
```

#### 2. `timeController.ts`

Contrôleur avec toutes les opérations.

**Endpoints :**

**POST `/api/time/start`**
```typescript
startTimeEntry(req, res)
// Crée une nouvelle session
// Vérifie qu'il n'y a pas de session active
```

**PATCH `/api/time/:id/pause`**
```typescript
pauseTimeEntry(req, res)
// Met en pause la session
// Enregistre pausedAt
```

**PATCH `/api/time/:id/resume`**
```typescript
resumeTimeEntry(req, res)
// Reprend la session
// Ajoute la durée de pause à totalPauseDuration
```

**PATCH `/api/time/:id/stop`**
```typescript
stopTimeEntry(req, res)
// Arrête la session
// Calcule la durée finale
// Met à jour card.actualTime
```

**GET `/api/time/card/:cardId`**
```typescript
getTimeEntriesByCard(req, res)
// Récupère toutes les entrées d'une carte
```

**GET `/api/time/card/:cardId/active`**
```typescript
getActiveTimeEntry(req, res)
// Récupère la session active (endTime = null)
```

**PATCH `/api/time/:id`**
```typescript
updateTimeEntry(req, res)
// Met à jour une entrée
```

**DELETE `/api/time/:id`**
```typescript
deleteTimeEntry(req, res)
// Supprime une entrée
```

**GET `/api/time/report`**
```typescript
getTimeReport(req, res)
// Génère un rapport
// Query params: boardId, startDate, endDate, groupBy
```

**GET `/api/time/export`**
```typescript
exportTimeEntries(req, res)
// Exporte en CSV
// Format Excel compatible
```

#### 3. `timeService.ts` (Frontend)

Service API pour les appels.

**Méthodes :**
```typescript
start(cardId, userId?, description?)
pause(id)
resume(id)
stop(id, description?)
update(id, data)
delete(id)
getByCard(cardId)
getActive(cardId)
getReport(params)
exportCSV(params)
formatDuration(minutes)
calculateElapsed(startTime, pausedAt?, totalPauseDuration?)
```

## 🔄 Flux de données

### 1. Démarrage du timer

```
User clicks "▶️ Start"
    ↓
TimeTracker.handleStart()
    ↓
timeService.start(cardId)
    ↓
POST /api/time/start
    ↓
timeController.startTimeEntry()
    ↓
TimeEntry.create({ cardId, startTime: now, isPaused: false })
    ↓
Return TimeEntry
    ↓
setActiveEntry(entry)
    ↓
Interval starts: updates elapsed every second
```

### 2. Arrêt du timer

```
User clicks "⏹️ Stop"
    ↓
TimeTracker.handleStop()
    ↓
timeService.stop(entry.id)
    ↓
PATCH /api/time/:id/stop
    ↓
timeController.stopTimeEntry()
    ↓
Calculate duration (with pauses)
    ↓
Update TimeEntry: { endTime, duration }
    ↓
Update Card.actualTime (sum of all durations)
    ↓
Return TimeEntry
    ↓
setActiveEntry(null)
    ↓
onTimeUpdate() → refreshes parent
```

### 3. Calcul du temps réel

```
DetailsPanel mounted
    ↓
useEffect → loadTimeEntries()
    ↓
GET /api/time/card/:cardId
    ↓
timeController.getTimeEntriesByCard()
    ↓
TimeEntry.findAll({ where: { cardId } })
    ↓
Return TimeEntry[]
    ↓
Calculate total: sum(entry.duration)
    ↓
Display in UI (read-only)
```

### 4. Génération de rapport

```
User clicks "Générer le rapport"
    ↓
Reports.loadReport()
    ↓
GET /api/time/report?boardId=...&groupBy=card
    ↓
timeController.getTimeReport()
    ↓
TimeEntry.findAll({ include: Card, Board })
    ↓
Filter by boardId, dates
    ↓
Group by card/day/project
    ↓
Calculate totals and stats
    ↓
Return { report, summary }
    ↓
Display graphs and table
```

## 📖 Guide d'utilisation

### Utilisation basique

#### 1. Démarrer le timer sur une carte

**Depuis le Kanban :**
1. Cliquer sur le bouton "▶️ Start" dans la carte
2. Le timer démarre immédiatement
3. Le compteur s'affiche : "⏱️ 0h 1m"

**Depuis le modal :**
1. Ouvrir une carte
2. Section "⏱️ Suivi du temps"
3. Cliquer sur "▶️ Démarrer"
4. Le timer s'affiche : "00:00:01"

#### 2. Mettre en pause

1. Cliquer sur "⏸️ Pause"
2. Le timer se fige
3. Le statut change : "⏸️ En pause"

#### 3. Reprendre

1. Cliquer sur "▶️ Reprendre"
2. Le timer repart
3. La durée de pause est enregistrée

#### 4. Arrêter le timer

1. Cliquer sur "⏹️ Arrêter"
2. Option : Ajouter une description
3. La session est sauvegardée
4. Le temps réel de la carte se met à jour

### Fonctionnalités avancées

#### Éditer une session

1. Aller dans "⏱️ Temps"
2. Cliquer sur une session
3. Modifier les champs
4. Cliquer sur "Enregistrer"

#### Générer un rapport

1. Aller dans "📊 Rapports"
2. Sélectionner un projet
3. Choisir une période
4. Choisir le groupement (carte/jour/projet)
5. Cliquer sur "Générer le rapport"

#### Exporter en CSV

1. Dans "📊 Rapports"
2. Configurer les filtres
3. Cliquer sur "📥 Exporter CSV"
4. Le fichier se télécharge

## 📊 Exemples

### Exemple 1 : Session simple

```typescript
// Démarrage
POST /api/time/start
{
  "cardId": "abc-123",
  "userId": "user-1"
}

// Réponse
{
  "id": "entry-1",
  "cardId": "abc-123",
  "startTime": "2025-10-12T14:30:00Z",
  "isPaused": false,
  "totalPauseDuration": 0
}

// 2h plus tard - Arrêt
PATCH /api/time/entry-1/stop
{
  "description": "Développement de l'API REST"
}

// Réponse
{
  "id": "entry-1",
  "cardId": "abc-123",
  "startTime": "2025-10-12T14:30:00Z",
  "endTime": "2025-10-12T16:30:00Z",
  "duration": 120, // minutes
  "description": "Développement de l'API REST"
}
```

### Exemple 2 : Session avec pauses

```typescript
// 1. Start
POST /api/time/start → { startTime: "14:30:00" }

// 2. Pause (15:00)
PATCH /api/time/:id/pause → { isPaused: true, pausedAt: "15:00:00" }

// 3. Resume (15:15)
PATCH /api/time/:id/resume → {
  isPaused: false,
  pausedAt: null,
  totalPauseDuration: 15 // minutes
}

// 4. Stop (16:30)
PATCH /api/time/:id/stop → {
  endTime: "16:30:00",
  duration: 105 // 120min - 15min pause
}
```

### Exemple 3 : Rapport par carte

```typescript
GET /api/time/report?boardId=board-1&groupBy=card

// Réponse
{
  "report": [
    {
      "cardId": "card-1",
      "cardTitle": "Développer l'API",
      "cardKey": "PROJ-1",
      "boardName": "Mon Projet",
      "totalDuration": 450, // minutes
      "entriesCount": 5,
      "entries": [...]
    },
    {
      "cardId": "card-2",
      "cardTitle": "Design UI",
      "cardKey": "PROJ-2",
      "boardName": "Mon Projet",
      "totalDuration": 180,
      "entriesCount": 2,
      "entries": [...]
    }
  ],
  "summary": {
    "totalDuration": 630,
    "totalDurationHours": 10,
    "totalDurationMinutes": 30,
    "totalEntries": 7,
    "groupBy": "card"
  }
}
```

### Exemple 4 : Export CSV

```csv
Project,Card Key,Card Title,Start Time,End Time,Duration (min),Duration (hours),Description,User
Mon Projet,PROJ-1,Développer l'API,2025-10-12T14:30:00Z,2025-10-12T16:30:00Z,120,2.00,"Dev API REST","user-1"
Mon Projet,PROJ-1,Développer l'API,2025-10-13T10:00:00Z,2025-10-13T12:15:00Z,135,2.25,"Tests unitaires","user-1"
Mon Projet,PROJ-2,Design UI,2025-10-13T14:00:00Z,2025-10-13T16:30:00Z,150,2.50,"Maquettes Figma","user-2"
```

## 🎯 Points clés

### Avantages

✅ **Précision** : Timer au format HH:MM:SS
✅ **Flexibilité** : Pause/Resume
✅ **Traçabilité** : Historique complet
✅ **Analyse** : Rapports et graphiques
✅ **Export** : CSV pour Excel
✅ **Intégration** : Dans les cartes Kanban
✅ **Automatisation** : Calcul temps réel

### Limitations actuelles

⚠️ **Mono-utilisateur** : Pas d'auth encore
⚠️ **Pas d'export PDF** : Seulement CSV
⚠️ **Pas de timer global** : Un par carte uniquement
⚠️ **Pas d'objectifs** : Pas de budgets temps

### Évolutions possibles (Sprint 3+)

- 🔐 Multi-utilisateurs avec permissions
- 📱 Application mobile
- 🔔 Notifications de rappel
- 🎯 Objectifs et budgets temps
- 📄 Export PDF
- 🔄 Synchronisation cloud
- 📊 Dashboard temps réel
- 🤖 Suggestions IA

## 📝 Résumé

Le Sprint 2 a implémenté un **système complet de Time Tracking** avec :

### Backend (5 fichiers)
- ✅ Modèle `TimeEntry` (Sequelize)
- ✅ Contrôleur `timeController` (9 endpoints)
- ✅ Routes `/api/time/*`
- ✅ Migration de base de données
- ✅ Relations Card ↔ TimeEntry

### Frontend (6 composants)
- ✅ `TimeTracker` : Timer intégré
- ✅ `TimeTrackerView` : Liste complète
- ✅ `TimeEntryModal` : Édition
- ✅ `DetailsPanel` : Temps réel calculé
- ✅ `SummaryView` : Statistiques
- ✅ `Reports` : Graphiques et export

### Fonctionnalités (20+)
- ✅ Timer Start/Pause/Resume/Stop
- ✅ Gestion des pauses
- ✅ Calcul automatique du temps
- ✅ Vue Temps (style Clockify)
- ✅ Édition complète des sessions
- ✅ Filtres par date et carte
- ✅ Groupement par jour
- ✅ Page Rapports avec graphiques
- ✅ Export CSV
- ✅ Top 5 des cartes
- ✅ Barre de progression
- ✅ Indicateurs de dépassement

### Résultat

🎉 **Sprint 2 terminé avec succès !**

Le système de Time Tracking est **pleinement fonctionnel** et **prêt pour la production**.

---

*Dernière mise à jour : 12 octobre 2025*

