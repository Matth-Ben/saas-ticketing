# 💰 Sprint 3 - Devis & Rentabilité

Documentation complète du module de gestion des devis et d'analyse de rentabilité implémenté dans le Sprint 3.

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

Le Sprint 3 ajoute un système complet de gestion des devis et d'analyse de rentabilité au projet, permettant :
- 💰 Création et gestion de devis détaillés
- 📊 Analyse de rentabilité en temps réel
- 📈 Graphiques de performance financière
- 📄 Export PDF professionnel
- 🔄 Import/Export de données
- ⚡ Génération automatique depuis les tâches

### Inspirations

Le système s'inspire des meilleures pratiques de :
- **FreshBooks** : Gestion des devis et facturation
- **QuickBooks** : Analyse de rentabilité
- **Zoho Invoice** : Export PDF professionnel
- **Clockify** : Intégration temps/coûts

## 🏗️ Architecture

### Stack technique

**Backend :**
```
Quote (Model)
    ↓
QuoteLine (Model)
    ↓
quoteController (CRUD + Import + Stats)
    ↓
quoteRoutes (/api/quote/*)
```

**Frontend :**
```
QuoteView (Interface principale)
    ↓
ProfitabilityChart (Graphiques)
    ↓
QuotePDFExport (Export)
    ↓
quoteService (API calls)
```

### Modèle de données

```typescript
interface Quote {
  id: string                    // UUID
  boardId: string              // Référence au projet
  quoteNumber: string          // Numéro unique (DEV-2025-001)
  title: string                // Titre du devis
  description?: string         // Description détaillée
  clientName: string           // Nom du client
  clientEmail?: string         // Email du client
  clientAddress?: string       // Adresse du client
  status: QuoteStatus          // Statut (draft, sent, accepted, etc.)
  validUntil?: Date            // Date de validité
  totalAmount: number          // Montant total HT
  totalHours: number           // Heures totales
  hourlyRate: number           // Taux horaire
  margin: number               // Marge en %
  lines?: QuoteLine[]          // Lignes de détail
  createdAt: Date
  updatedAt: Date
}

interface QuoteLine {
  id: string                   // UUID
  quoteId: string              // Référence au devis
  cardId?: string              // Référence à la tâche (optionnel)
  lineNumber: number           // Numéro de ligne
  type: QuoteLineType          // Type (task, material, service, discount)
  title: string                // Titre de la ligne
  description?: string         // Description
  quantity: number             // Quantité
  unitPrice: number            // Prix unitaire
  totalPrice: number           // Prix total
  estimatedHours?: number      // Heures estimées
  actualHours?: number         // Heures réelles
  category?: string            // Catégorie
  createdAt: Date
  updatedAt: Date
}
```

## ✨ Fonctionnalités

### 1. Interface de gestion des devis

#### Vue principale (QuoteView)
```
┌──────────────────────────────────────────────────────┐
│ 📋 Devis (3)                    [⚡ Auto] [📥 Import] [➕ Nouveau] │
├──────────────────────────────────────────────────────┤
│ DEV-2025-001                    📤 Envoyé    🗑️      │
│ Site e-commerce                  Client ABC           │
│ 2 500,00€ • 50h                                    │
├──────────────────────────────────────────────────────┤
│ DEV-2025-002                    📝 Brouillon  🗑️      │
│ Application mobile               Client XYZ           │
│ 1 800,00€ • 36h                                    │
└──────────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Liste de tous les devis du projet
- ✅ Statuts visuels avec couleurs
- ✅ Montants et heures affichés
- ✅ Actions rapides (supprimer)
- ✅ Boutons de création (Auto, Import, Nouveau)

#### Détails du devis sélectionné
```
┌──────────────────────────────────────────────────────┐
│ Devis DEV-2025-001                    📤 Envoyé [📄 PDF] [✏️ Modifier] │
│ Site e-commerce • Client ABC                         │
├──────────────────────────────────────────────────────┤
│ Montant total    Heures totales    Taux horaire    Marge │
│ 2 500,00€       50h               50,00€/h        20%   │
├──────────────────────────────────────────────────────┤
│ Lignes du devis (4)                    [➕ Ajouter une ligne] │
├────────┬─────────────┬─────┬─────────┬─────────┬────────┤
│ #      │ Titre       │ Qté │ Prix un.│ Total   │ Heures │
├────────┼─────────────┼─────┼─────────┼─────────┼────────┤
│ 1      │ Design UI   │ 1   │ 800,00€ │ 800,00€ │ 16h    │
│ 2      │ Dev Front   │ 1   │ 1200,00€│ 1200,00€│ 24h    │
│ 3      │ Tests       │ 1   │ 500,00€ │ 500,00€ │ 10h    │
└────────┴─────────────┴─────┴─────────┴─────────┴────────┘
```

**Fonctionnalités :**
- ✅ En-tête avec informations client
- ✅ Statistiques financières
- ✅ Tableau des lignes détaillées
- ✅ Édition inline des lignes
- ✅ Liens vers les tâches associées
- ✅ Export PDF intégré

### 2. Création de devis

#### Création manuelle
```
┌──────────────────────────────────┐
│ Créer un nouveau devis           │
├──────────────────────────────────┤
│ Titre *: [Site e-commerce      ] │
│ Nom du client *: [Client ABC   ] │
│ Email du client: [abc@test.com ] │
│ Taux horaire (€): [50] Marge (%): [20] │
│                                  │
│ [Annuler] [Créer]                │
└──────────────────────────────────┘
```

#### Génération automatique
```
┌──────────────────────────────────┐
│ Générer un devis automatiquement │
├──────────────────────────────────┤
│ Taux horaire (€): [50]           │
│ Marge (%): [20]                  │
│ ☐ Inclure les tâches terminées   │
│                                  │
│ [Annuler] [Générer]              │
└──────────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Création manuelle avec formulaire
- ✅ Génération automatique depuis les tâches
- ✅ Calcul automatique des montants
- ✅ Options de configuration (taux, marge)
- ✅ Filtrage des tâches (terminées ou non)

#### Import de données
```
┌──────────────────────────────────┐
│ Importer un devis                │
├──────────────────────────────────┤
│ Format: [JSON ▼]                 │
│                                  │
│ Données:                         │
│ ┌──────────────────────────────┐ │
│ │ [                           ] │ │
│ │ [                           ] │ │
│ │ [                           ] │ │
│ └──────────────────────────────┘ │
│                                  │
│ [Annuler] [Importer]             │
└──────────────────────────────────┘
```

**Formats supportés :**
- ✅ **JSON** : Structure objet/array
- ✅ **CSV** : Format tabulaire avec en-têtes

### 3. Graphiques de rentabilité

#### Dashboard de rentabilité
```
┌──────────────────────────────────────────────────────┐
│ 💰 Rentabilité des Devis                            │
├──────────────────────────────────────────────────────┤
│ Estimé      Réel        Rentabilité    Nombre       │
│ 4 300,00€   3 800,00€   +13,2%        3 devis      │
├──────────────────────────────────────────────────────┤
│ [Graphique à barres - Estimé vs Réel]               │
│ [Graphique circulaire - Répartition]                │
├──────────────────────────────────────────────────────┤
│ Détail par Devis                                     │
│ DEV-001  Site e-com  2 500€  2 200€  50h  45h  +13,6% │
│ DEV-002  App mobile  1 800€  1 600€  36h  32h  +12,5% │
└──────────────────────────────────────────────────────┘
```

**Indicateurs :**
- ✅ Montants estimés vs réels
- ✅ Pourcentage de rentabilité
- ✅ Heures estimées vs réelles
- ✅ Graphiques interactifs (Recharts)
- ✅ Tableau détaillé par devis

#### Graphiques visuels

**Graphique à barres :**
- Barres bleues : Montants estimés
- Barres vertes : Montants réels
- Tooltip avec détails
- Axes formatés (k€)

**Graphique circulaire :**
- Secteurs colorés par rentabilité
- Légende interactive
- Pourcentages affichés

### 4. Export PDF professionnel

#### Génération PDF
```
┌──────────────────────────────────────────────────────┐
│                    DEVIS                             │
│              DEV-2025-001                            │
├──────────────────────────────────────────────────────┤
│ Votre Entreprise              Date: 12/10/2025      │
│ Adresse de l'entreprise       Validité: 30/10/2025  │
│ Tél: +33 1 23 45 67 89        Statut: Envoyé        │
│ Email: contact@entreprise.com                        │
├──────────────────────────────────────────────────────┤
│ CLIENT                                                 │
│ Client ABC                                            │
│ Email: abc@test.com                                   │
│ Adresse: 123 Rue Example, 75001 Paris                │
├──────────────────────────────────────────────────────┤
│ #  Description        Qté  Prix un.  Total    Heures │
│ 1  Design UI          1    800,00€   800,00€  16h    │
│ 2  Développement      1    1200,00€  1200,00€ 24h    │
│ 3  Tests              1    500,00€   500,00€  10h    │
├──────────────────────────────────────────────────────┤
│ Sous-total HT:        2 500,00€                      │
│ Marge (20%):          500,00€                        │
│ TOTAL HT:             3 000,00€                      │
│ TVA (20%):            600,00€                        │
│ TOTAL TTC:            3 600,00€                      │
├──────────────────────────────────────────────────────┤
│ Conditions générales:                                │
│ • Validité: 30 jours                                 │
│ • Délai de paiement: 30 jours                        │
│ • Acompte: 30%                                        │
└──────────────────────────────────────────────────────┘
```

**Caractéristiques :**
- ✅ Design professionnel
- ✅ En-tête avec logo/entreprise
- ✅ Informations client complètes
- ✅ Tableau détaillé des lignes
- ✅ Calculs automatiques (HT, TTC, marge)
- ✅ Conditions générales
- ✅ Impression optimisée

### 5. Intégration dans les vues existantes

#### Onglet "Devis" dans ProjectView
```
┌──────────────────────────────────────────────────────┐
│ [📊 Résumé] [📋 Tableau] [📝 Liste] [⏱️ Temps] [💰 Devis] │
├──────────────────────────────────────────────────────┤
│ Interface complète de gestion des devis              │
└──────────────────────────────────────────────────────┘
```

#### Graphique dans le Résumé
```
┌──────────────────────────────────────────────────────┐
│ 💰 Rentabilité des Devis                            │
│ [Graphiques et statistiques intégrés]               │
└──────────────────────────────────────────────────────┘
```

## 🔧 Composants

### Backend

#### 1. `Quote.ts` (Model)

Modèle Sequelize pour les devis.

**Champs :**
```typescript
{
  id: UUID,
  boardId: UUID (FK → boards),
  quoteNumber: STRING (unique),
  title: STRING,
  description: TEXT (nullable),
  clientName: STRING,
  clientEmail: STRING (nullable),
  clientAddress: TEXT (nullable),
  status: ENUM (draft, sent, accepted, rejected, invoiced),
  validUntil: DATE (nullable),
  totalAmount: DECIMAL(10,2),
  totalHours: DECIMAL(8,2),
  hourlyRate: DECIMAL(8,2),
  margin: DECIMAL(5,2)
}
```

**Relations :**
```typescript
Board.hasMany(Quote, { foreignKey: 'boardId', as: 'quotes' })
Quote.belongsTo(Board, { foreignKey: 'boardId', as: 'board' })
Quote.hasMany(QuoteLine, { foreignKey: 'quoteId', as: 'lines' })
```

#### 2. `QuoteLine.ts` (Model)

Modèle Sequelize pour les lignes de devis.

**Champs :**
```typescript
{
  id: UUID,
  quoteId: UUID (FK → quotes),
  cardId: UUID (FK → cards, nullable),
  lineNumber: INTEGER,
  type: ENUM (task, material, service, discount),
  title: STRING,
  description: TEXT (nullable),
  quantity: DECIMAL(8,2),
  unitPrice: DECIMAL(10,2),
  totalPrice: DECIMAL(10,2),
  estimatedHours: DECIMAL(8,2) (nullable),
  actualHours: DECIMAL(8,2) (nullable),
  category: STRING (nullable)
}
```

**Relations :**
```typescript
QuoteLine.belongsTo(Quote, { foreignKey: 'quoteId', as: 'quote' })
QuoteLine.belongsTo(Card, { foreignKey: 'cardId', as: 'card' })
Card.hasMany(QuoteLine, { foreignKey: 'cardId', as: 'quoteLines' })
```

#### 3. `quoteController.ts`

Contrôleur avec toutes les opérations.

**Endpoints :**

**GET `/api/quote/board/:boardId`**
```typescript
getQuotesByBoard(req, res)
// Récupère tous les devis d'un projet
// Include: lines, card
```

**GET `/api/quote/:id`**
```typescript
getQuoteById(req, res)
// Récupère un devis par ID
// Include: board, lines, card
```

**POST `/api/quote`**
```typescript
createQuote(req, res)
// Crée un nouveau devis
// Génère automatiquement le numéro
```

**PUT `/api/quote/:id`**
```typescript
updateQuote(req, res)
// Met à jour un devis
// Recalcule les totaux si nécessaire
```

**DELETE `/api/quote/:id`**
```typescript
deleteQuote(req, res)
// Supprime un devis et ses lignes
```

**POST `/api/quote/:quoteId/lines`**
```typescript
addQuoteLine(req, res)
// Ajoute une ligne au devis
// Recalcule les totaux
```

**PUT `/api/quote/lines/:id`**
```typescript
updateQuoteLine(req, res)
// Met à jour une ligne
// Recalcule le prix total
```

**DELETE `/api/quote/lines/:id`**
```typescript
deleteQuoteLine(req, res)
// Supprime une ligne
// Recalcule les totaux du devis
```

**POST `/api/quote/board/:boardId/import`**
```typescript
importQuote(req, res)
// Importe un devis depuis JSON/CSV
// Crée automatiquement les lignes
```

**POST `/api/quote/board/:boardId/generate`**
```typescript
generateQuoteFromTasks(req, res)
// Génère un devis depuis les tâches
// Options: hourlyRate, margin, includeCompleted
```

**GET `/api/quote/board/:boardId/profitability`**
```typescript
getProfitabilityStats(req, res)
// Calcule les statistiques de rentabilité
// Compare estimé vs réel
```

### Frontend

#### 1. `QuoteView.tsx`

Interface principale de gestion des devis.

**Props :**
```typescript
interface QuoteViewProps {
  board: Board
  onEditCard?: (card: any) => void
}
```

**États :**
```typescript
const [quotes, setQuotes] = useState<Quote[]>([])
const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [showCreateModal, setShowCreateModal] = useState(false)
const [showImportModal, setShowImportModal] = useState(false)
const [showGenerateModal, setShowGenerateModal] = useState(false)
```

**Fonctionnalités :**
- Liste des devis avec statuts
- Sélection et affichage des détails
- Modals de création/import/génération
- Actions CRUD complètes

#### 2. `ProfitabilityChart.tsx`

Composant de graphiques de rentabilité.

**Props :**
```typescript
interface ProfitabilityChartProps {
  board: Board
}
```

**Fonctionnalités :**
- Graphique à barres (estimé vs réel)
- Graphique circulaire (répartition)
- Tableau détaillé
- Indicateurs de performance
- Responsive design

#### 3. `QuotePDFExport.tsx`

Composant d'export PDF.

**Props :**
```typescript
interface QuotePDFExportProps {
  quote: Quote
}
```

**Fonctionnalités :**
- Génération HTML optimisée
- Design professionnel
- Calculs automatiques
- Impression/PDF
- Conditions générales

#### 4. `quoteService.ts`

Service API pour les devis.

**Méthodes :**
```typescript
getByBoard(boardId)
getById(id)
create(quoteData)
update(id, quoteData)
delete(id)
addLine(quoteId, lineData)
updateLine(id, lineData)
deleteLine(id)
import(boardId, format, data)
generateFromTasks(boardId, options)
getProfitabilityStats(boardId)
formatAmount(amount)
formatHours(hours)
calculateProfitability(estimated, actual)
getProfitabilityColor(profitability)
getStatusLabel(status)
getStatusColor(status)
validateQuote(quote)
validateQuoteLine(line)
```

## 🔄 Flux de données

### 1. Création d'un devis

```
User clicks "➕ Nouveau"
    ↓
CreateQuoteModal opens
    ↓
User fills form and submits
    ↓
quoteService.create(quoteData)
    ↓
POST /api/quote
    ↓
quoteController.createQuote()
    ↓
generateQuoteNumber() → "DEV-2025-001"
    ↓
Quote.create({ ...quoteData, quoteNumber })
    ↓
Return Quote
    ↓
setQuotes([newQuote, ...quotes])
    ↓
Modal closes, list updates
```

### 2. Génération automatique

```
User clicks "⚡ Auto"
    ↓
GenerateQuoteModal opens
    ↓
User sets hourlyRate, margin, includeCompleted
    ↓
quoteService.generateFromTasks(boardId, options)
    ↓
POST /api/quote/board/:boardId/generate
    ↓
quoteController.generateQuoteFromTasks()
    ↓
Card.findAll({ where: { boardId, parentId: null } })
    ↓
For each card:
  - Calculate unitPrice = hourlyRate × estimatedTime
  - Create QuoteLine
    ↓
Quote.create() with calculated totals
    ↓
Return complete Quote with lines
    ↓
setQuotes([newQuote, ...quotes])
```

### 3. Import de données

```
User clicks "📥 Import"
    ↓
ImportQuoteModal opens
    ↓
User selects format (JSON/CSV) and pastes data
    ↓
quoteService.import(boardId, format, data)
    ↓
POST /api/quote/board/:boardId/import
    ↓
quoteController.importQuote()
    ↓
Parse data (JSON.parse() or CSV parsing)
    ↓
Quote.create() with generated number
    ↓
For each item:
  - Create QuoteLine with parsed data
    ↓
recalculateQuoteTotals()
    ↓
Return complete Quote
    ↓
setQuotes([newQuote, ...quotes])
```

### 4. Calcul de rentabilité

```
ProfitabilityChart mounts
    ↓
useEffect → loadProfitabilityStats()
    ↓
quoteService.getProfitabilityStats(boardId)
    ↓
GET /api/quote/board/:boardId/profitability
    ↓
quoteController.getProfitabilityStats()
    ↓
Quote.findAll({ where: { boardId }, include: [lines, card] })
    ↓
For each quote:
  - Calculate estimatedAmount from lines
  - Calculate actualAmount from TimeEntries
  - Calculate profitability percentage
    ↓
Return { quotes: [...], summary: {...} }
    ↓
Display charts and statistics
```

### 5. Export PDF

```
User clicks "📄 Exporter PDF"
    ↓
QuotePDFExport.handleExportPDF()
    ↓
generateQuoteHTML(quote)
    ↓
Create printWindow with HTML content
    ↓
printWindow.print()
    ↓
User can save as PDF or print
```

## 📖 Guide d'utilisation

### Utilisation basique

#### 1. Créer un devis manuellement

1. Aller dans l'onglet "💰 Devis"
2. Cliquer sur "➕ Nouveau"
3. Remplir le formulaire :
   - Titre du devis
   - Nom du client
   - Email (optionnel)
   - Taux horaire
   - Marge
4. Cliquer sur "Créer"
5. Ajouter des lignes avec "➕ Ajouter une ligne"

#### 2. Générer un devis automatiquement

1. Cliquer sur "⚡ Auto"
2. Configurer :
   - Taux horaire (ex: 50€/h)
   - Marge (ex: 20%)
   - Inclure les tâches terminées (optionnel)
3. Cliquer sur "Générer"
4. Le devis est créé avec toutes les tâches du projet

#### 3. Importer un devis

**Format JSON :**
```json
[
  {
    "title": "Design UI",
    "quantity": 1,
    "price": 800,
    "hours": 16,
    "description": "Interface utilisateur"
  },
  {
    "title": "Développement",
    "quantity": 1,
    "price": 1200,
    "hours": 24
  }
]
```

**Format CSV :**
```csv
title,quantity,price,hours,description
Design UI,1,800,16,Interface utilisateur
Développement,1,1200,24,Code application
```

### Fonctionnalités avancées

#### Éditer un devis

1. Sélectionner un devis dans la liste
2. Cliquer sur "✏️ Modifier"
3. Modifier les champs souhaités
4. Cliquer sur "✓ Sauvegarder"

#### Éditer une ligne

1. Dans le tableau des lignes
2. Cliquer sur "✏️" sur la ligne
3. Modifier les champs inline
4. Cliquer sur "✓" pour sauvegarder

#### Exporter en PDF

1. Sélectionner un devis
2. Cliquer sur "📄 Exporter PDF"
3. Une nouvelle fenêtre s'ouvre avec le devis formaté
4. Utiliser Ctrl+P pour imprimer ou sauvegarder en PDF

#### Analyser la rentabilité

1. Aller dans l'onglet "📊 Résumé"
2. Section "💰 Rentabilité des Devis"
3. Consulter les graphiques et statistiques
4. Analyser les écarts estimé vs réel

## 📊 Exemples

### Exemple 1 : Devis simple

```typescript
// Création
POST /api/quote
{
  "boardId": "board-123",
  "title": "Site e-commerce",
  "clientName": "Client ABC",
  "clientEmail": "abc@test.com",
  "hourlyRate": 50,
  "margin": 20
}

// Réponse
{
  "id": "quote-456",
  "boardId": "board-123",
  "quoteNumber": "DEV-2025-001",
  "title": "Site e-commerce",
  "clientName": "Client ABC",
  "status": "draft",
  "totalAmount": 0,
  "totalHours": 0,
  "hourlyRate": 50,
  "margin": 20
}
```

### Exemple 2 : Ligne de devis

```typescript
// Ajout d'une ligne
POST /api/quote/quote-456/lines
{
  "type": "task",
  "title": "Design UI",
  "description": "Interface utilisateur responsive",
  "quantity": 1,
  "unitPrice": 800,
  "estimatedHours": 16,
  "category": "Design"
}

// Réponse
{
  "id": "line-789",
  "quoteId": "quote-456",
  "lineNumber": 1,
  "type": "task",
  "title": "Design UI",
  "quantity": 1,
  "unitPrice": 800,
  "totalPrice": 800,
  "estimatedHours": 16
}
```

### Exemple 3 : Génération automatique

```typescript
// Génération depuis les tâches
POST /api/quote/board/board-123/generate
{
  "hourlyRate": 50,
  "margin": 20,
  "includeCompleted": false
}

// Le système :
// 1. Récupère toutes les tâches du projet
// 2. Pour chaque tâche :
//    - unitPrice = hourlyRate × estimatedTime
//    - Crée une QuoteLine
// 3. Calcule les totaux
// 4. Retourne le devis complet
```

### Exemple 4 : Statistiques de rentabilité

```typescript
GET /api/quote/board/board-123/profitability

// Réponse
{
  "quotes": [
    {
      "quoteId": "quote-456",
      "quoteNumber": "DEV-2025-001",
      "title": "Site e-commerce",
      "estimatedAmount": 2500,
      "actualAmount": 2200,
      "estimatedHours": 50,
      "actualHours": 45,
      "profitability": 13.6
    }
  ],
  "summary": {
    "totalEstimatedAmount": 2500,
    "totalActualAmount": 2200,
    "overallProfitability": 13.6,
    "totalQuotes": 1
  }
}
```

### Exemple 5 : Import CSV

```csv
title,quantity,price,hours,description,category
Design UI,1,800,16,Interface utilisateur,Design
Développement Frontend,1,1200,24,Code React,Development
Tests,1,500,10,Tests unitaires,Testing
```

**Résultat :**
- Devis créé avec 3 lignes
- Totaux calculés automatiquement
- Lignes numérotées séquentiellement

## 🎯 Points clés

### Avantages

✅ **Complétude** : Gestion complète des devis
✅ **Automatisation** : Génération depuis les tâches
✅ **Flexibilité** : Import/Export multiples formats
✅ **Analyse** : Rentabilité en temps réel
✅ **Professionnalisme** : Export PDF de qualité
✅ **Intégration** : Liens avec tâches et temps
✅ **Interface** : UX intuitive et responsive

### Limitations actuelles

⚠️ **Pas de facturation** : Seulement devis
⚠️ **Mono-devise** : Seulement euros
⚠️ **Pas de templates** : Devis standard uniquement
⚠️ **Pas de signatures** : Pas de validation électronique

### Évolutions possibles (Sprint 4+)

- 🧾 Module de facturation complet
- 💳 Gestion des paiements
- 📧 Envoi automatique par email
- 🎨 Templates de devis personnalisables
- 📱 Application mobile
- 🔔 Notifications de relance
- 📊 Dashboard financier avancé
- 🤖 IA pour suggestions de prix
- 🌍 Multi-devises
- ✍️ Signatures électroniques

## 📝 Résumé

Le Sprint 3 a implémenté un **système complet de gestion des devis** avec :

### Backend (4 fichiers)
- ✅ Modèles `Quote` et `QuoteLine` (Sequelize)
- ✅ Contrôleur `quoteController` (12 endpoints)
- ✅ Routes `/api/quote/*`
- ✅ Migration de base de données

### Frontend (4 composants)
- ✅ `QuoteView` : Interface principale
- ✅ `ProfitabilityChart` : Graphiques de rentabilité
- ✅ `QuotePDFExport` : Export PDF professionnel
- ✅ `quoteService` : Service API complet

### Fonctionnalités (25+)
- ✅ CRUD complet des devis
- ✅ Gestion des lignes de détail
- ✅ Génération automatique depuis les tâches
- ✅ Import JSON/CSV
- ✅ Export PDF professionnel
- ✅ Graphiques de rentabilité
- ✅ Calculs automatiques (HT, TTC, marge)
- ✅ Intégration dans les vues existantes
- ✅ Validation des données
- ✅ Interface responsive
- ✅ Statuts visuels
- ✅ Liens vers les tâches

### Résultat

🎉 **Sprint 3 terminé avec succès !**

Le module Devis & Rentabilité est **pleinement fonctionnel** et **prêt pour la production**.

---

*Dernière mise à jour : 12 octobre 2025*
