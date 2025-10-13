import api from './api'

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  INVOICED = 'invoiced',
}

export enum QuoteLineType {
  TASK = 'task',
  MATERIAL = 'material',
  SERVICE = 'service',
  DISCOUNT = 'discount',
}

export interface QuoteLine {
  id: string
  quoteId: string
  cardId?: string
  lineNumber: number
  type: QuoteLineType
  title: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  estimatedHours?: number
  actualHours?: number
  category?: string
  card?: {
    id: string
    key: string
    title: string
    status: string
    estimatedTime?: number
    actualTime?: number
  }
  createdAt: string
  updatedAt: string
}

export interface Quote {
  id: string
  boardId: string
  quoteNumber: string
  title: string
  description?: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  status: QuoteStatus
  validUntil?: string
  totalAmount: number
  totalHours: number
  hourlyRate: number
  margin: number
  board?: {
    id: string
    name: string
  }
  lines?: QuoteLine[]
  createdAt: string
  updatedAt: string
}

export interface ProfitabilityData {
  quoteId: string
  quoteNumber: string
  title: string
  estimatedAmount: number
  actualAmount: number
  estimatedHours: number
  actualHours: number
  margin: number
  profitability: number
}

export interface ProfitabilityStats {
  quotes: ProfitabilityData[]
  summary: {
    totalEstimatedAmount: number
    totalActualAmount: number
    totalEstimatedHours: number
    totalActualHours: number
    overallProfitability: number
    totalQuotes: number
  }
}

class QuoteService {
  /**
   * Récupérer tous les devis d'un projet
   */
  async getByBoard(boardId: string): Promise<Quote[]> {
    const response = await api.get(`/quote/board/${boardId}`)
    return response.data
  }

  /**
   * Récupérer un devis par ID
   */
  async getById(id: string): Promise<Quote> {
    const response = await api.get(`/quote/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau devis
   */
  async create(quoteData: Partial<Quote>): Promise<Quote> {
    const response = await api.post('/quote', quoteData)
    return response.data
  }

  /**
   * Mettre à jour un devis
   */
  async update(id: string, quoteData: Partial<Quote>): Promise<Quote> {
    const response = await api.put(`/quote/${id}`, quoteData)
    return response.data
  }

  /**
   * Supprimer un devis
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/quote/${id}`)
  }

  /**
   * Ajouter une ligne au devis
   */
  async addLine(quoteId: string, lineData: Partial<QuoteLine>): Promise<QuoteLine> {
    const response = await api.post(`/quote/${quoteId}/lines`, lineData)
    return response.data
  }

  /**
   * Mettre à jour une ligne de devis
   */
  async updateLine(id: string, lineData: Partial<QuoteLine>): Promise<QuoteLine> {
    const response = await api.put(`/quote/lines/${id}`, lineData)
    return response.data
  }

  /**
   * Supprimer une ligne de devis
   */
  async deleteLine(id: string): Promise<void> {
    await api.delete(`/quote/lines/${id}`)
  }

  /**
   * Importer un devis depuis JSON ou CSV
   */
  async import(boardId: string, format: 'json' | 'csv', data: any): Promise<Quote> {
    const response = await api.post(`/quote/board/${boardId}/import`, {
      format,
      data,
    })
    return response.data
  }

  /**
   * Récupérer les tâches disponibles pour un devis
   */
  async getAvailableTasks(boardId: string, includeCompleted: boolean = false): Promise<any[]> {
    const response = await api.get(`/quote/board/${boardId}/tasks?includeCompleted=${includeCompleted}`)
    return response.data
  }

  /**
   * Générer automatiquement un devis depuis les tâches du projet
   */
  async generateFromTasks(
    boardId: string,
    options: {
      hourlyRate: number
      margin: number
      includeCompleted?: boolean
      selectedCardIds?: string[]
      title?: string
      clientName?: string
    }
  ): Promise<Quote> {
    const response = await api.post(`/quote/board/${boardId}/generate`, options)
    return response.data
  }

  /**
   * Obtenir les statistiques de rentabilité
   */
  async getProfitabilityStats(boardId: string): Promise<ProfitabilityStats> {
    const response = await api.get(`/quote/board/${boardId}/profitability`)
    return response.data
  }

  /**
   * Formater un montant en euros
   */
  formatAmount(amount: number | string | null | undefined): string {
    // Convertir en nombre et gérer les valeurs nulles/undefined
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0)
    
    // Vérifier que c'est un nombre valide
    if (isNaN(numAmount)) {
      return '0,00 €'
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(numAmount)
  }

  /**
   * Formater une durée en heures
   */
  formatHours(hours: number | string | null | undefined): string {
    // Convertir en nombre et gérer les valeurs nulles/undefined
    const numHours = typeof hours === 'string' ? parseFloat(hours) : (hours || 0)
    
    // Vérifier que c'est un nombre valide
    if (isNaN(numHours) || numHours < 0) {
      return '0h'
    }
    
    if (numHours < 1) {
      return `${Math.round(numHours * 60)}m`
    }
    if (numHours === Math.floor(numHours)) {
      return `${numHours}h`
    }
    return `${numHours.toFixed(1)}h`
  }

  /**
   * Calculer le pourcentage de rentabilité
   */
  calculateProfitability(estimated: number | string | null | undefined, actual: number | string | null | undefined): number {
    // Convertir en nombres
    const numEstimated = typeof estimated === 'string' ? parseFloat(estimated) : (estimated || 0)
    const numActual = typeof actual === 'string' ? parseFloat(actual) : (actual || 0)
    
    // Vérifier que ce sont des nombres valides
    if (isNaN(numEstimated) || isNaN(numActual) || numActual === 0) {
      return 0
    }
    
    return ((numEstimated - numActual) / numActual) * 100
  }

  /**
   * Obtenir la couleur selon la rentabilité
   */
  getProfitabilityColor(profitability: number): string {
    if (profitability > 20) return 'text-green-600 dark:text-green-400'
    if (profitability > 0) return 'text-yellow-600 dark:text-yellow-400'
    if (profitability > -10) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  /**
   * Obtenir le statut du devis en français
   */
  getStatusLabel(status: QuoteStatus): string {
    const labels = {
      [QuoteStatus.DRAFT]: 'Brouillon',
      [QuoteStatus.SENT]: 'Envoyé',
      [QuoteStatus.ACCEPTED]: 'Accepté',
      [QuoteStatus.REJECTED]: 'Rejeté',
      [QuoteStatus.INVOICED]: 'Facturé',
    }
    return labels[status]
  }

  /**
   * Obtenir la couleur du statut
   */
  getStatusColor(status: QuoteStatus): string {
    const colors = {
      [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      [QuoteStatus.SENT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      [QuoteStatus.ACCEPTED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      [QuoteStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      [QuoteStatus.INVOICED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    }
    return colors[status]
  }

  /**
   * Obtenir le type de ligne en français
   */
  getLineTypeLabel(type: QuoteLineType): string {
    const labels = {
      [QuoteLineType.TASK]: 'Tâche',
      [QuoteLineType.MATERIAL]: 'Matériel',
      [QuoteLineType.SERVICE]: 'Service',
      [QuoteLineType.DISCOUNT]: 'Remise',
    }
    return labels[type]
  }

  /**
   * Valider les données d'un devis
   */
  validateQuote(quote: Partial<Quote>): string[] {
    const errors: string[] = []

    if (!quote.title?.trim()) {
      errors.push('Le titre est obligatoire')
    }

    if (!quote.clientName?.trim()) {
      errors.push('Le nom du client est obligatoire')
    }

    if (quote.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.clientEmail)) {
      errors.push('L\'email du client n\'est pas valide')
    }

    if (quote.hourlyRate !== undefined && quote.hourlyRate < 0) {
      errors.push('Le taux horaire doit être positif')
    }

    if (quote.margin !== undefined && (quote.margin < 0 || quote.margin > 100)) {
      errors.push('La marge doit être entre 0 et 100%')
    }

    return errors
  }

  /**
   * Valider les données d'une ligne de devis
   */
  validateQuoteLine(line: Partial<QuoteLine>): string[] {
    const errors: string[] = []

    if (!line.title?.trim()) {
      errors.push('Le titre de la ligne est obligatoire')
    }

    if (line.quantity !== undefined && line.quantity <= 0) {
      errors.push('La quantité doit être positive')
    }

    if (line.unitPrice !== undefined && line.unitPrice < 0) {
      errors.push('Le prix unitaire doit être positif')
    }

    if (line.estimatedHours !== undefined && line.estimatedHours < 0) {
      errors.push('Les heures estimées doivent être positives')
    }

    return errors
  }

  /**
   * Exporter un devis en PDF (à implémenter plus tard)
   */
  async exportToPDF(quoteId: string): Promise<Blob> {
    // TODO: Implémenter l'export PDF
    throw new Error('Export PDF non encore implémenté')
  }

  /**
   * Calculer le montant avec marge
   */
  calculateAmountWithMargin(baseAmount: number | string | null | undefined, margin: number | string | null | undefined): number {
    const numBaseAmount = typeof baseAmount === 'string' ? parseFloat(baseAmount) : (baseAmount || 0)
    const numMargin = typeof margin === 'string' ? parseFloat(margin) : (margin || 0)
    
    if (isNaN(numBaseAmount) || isNaN(numMargin)) {
      return 0
    }
    
    return numBaseAmount * (1 + numMargin / 100)
  }

  /**
   * Calculer le montant HT depuis le montant TTC
   */
  calculateAmountWithoutMargin(amountWithMargin: number | string | null | undefined, margin: number | string | null | undefined): number {
    const numAmountWithMargin = typeof amountWithMargin === 'string' ? parseFloat(amountWithMargin) : (amountWithMargin || 0)
    const numMargin = typeof margin === 'string' ? parseFloat(margin) : (margin || 0)
    
    if (isNaN(numAmountWithMargin) || isNaN(numMargin) || numMargin === 0) {
      return 0
    }
    
    return numAmountWithMargin / (1 + numMargin / 100)
  }
}

export const quoteService = new QuoteService()
export default quoteService
