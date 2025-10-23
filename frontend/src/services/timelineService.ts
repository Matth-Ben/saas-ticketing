import { Card } from './boardService'

export interface TimelineCalculation {
  startDate: Date
  endDate: Date
  workDays: number
  estimatedHours: number
  actualHours: number
}

export interface TimelineSettings {
  workHoursPerDay: number
  workingDays: number[] // 1=Lundi, 2=Mardi, etc.
  startTime: string // Format HH:MM
  endTime: string // Format HH:MM
}

export const defaultTimelineSettings: TimelineSettings = {
  workHoursPerDay: 8,
  workingDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
  startTime: '09:00',
  endTime: '17:00'
}

export class TimelineService {
  /**
   * Calcule les dates prévisionnelles pour une liste de tickets
   */
  static calculateTimelineDates(
    cards: Card[], 
    startDate: Date, 
    settings: TimelineSettings = defaultTimelineSettings
  ): Map<string, TimelineCalculation> {
    const calculations = new Map<string, TimelineCalculation>()
    const parentCards = cards.filter(card => !card.parentId)
    const subtaskCards = cards.filter(card => card.parentId)
    
    // Grouper les sous-tâches par parent
    const subtasksByParent = subtaskCards.reduce((acc, subtask) => {
      if (!acc[subtask.parentId!]) {
        acc[subtask.parentId!] = []
      }
      acc[subtask.parentId!].push(subtask)
      return acc
    }, {} as Record<string, Card[]>)

    let currentDate = new Date(startDate)
    
    // Calculer pour chaque ticket parent
    for (const card of parentCards) {
      const subtasks = subtasksByParent[card.id] || []
      const estimatedTime = card.estimatedTime || 0
      const actualTime = card.actualTime || 0
      
      // Utiliser le temps réel s'il existe, sinon l'estimé
      const timeToUse = actualTime > 0 ? actualTime : estimatedTime
      
      // Calculer la date de fin basée sur le temps
      const workDays = Math.ceil(timeToUse / settings.workHoursPerDay)
      const endDate = this.addWorkingDays(currentDate, workDays, settings.workingDays)
      
      calculations.set(card.id, {
        startDate: new Date(currentDate),
        endDate,
        workDays,
        estimatedHours: estimatedTime,
        actualHours: actualTime
      })
      
      // Passer à la date suivante pour le prochain ticket
      currentDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
    }
    
    return calculations
  }

  /**
   * Ajoute des jours ouvrables à une date
   */
  static addWorkingDays(
    date: Date, 
    days: number, 
    workingDays: number[] = [1, 2, 3, 4, 5]
  ): Date {
    const result = new Date(date)
    let addedDays = 0
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1)
      if (workingDays.includes(result.getDay())) {
        addedDays++
      }
    }
    
    return result
  }

  /**
   * Génère une plage de dates pour l'affichage du calendrier
   */
  static generateCalendarDates(
    startDate: Date, 
    endDate: Date, 
    workingDays: number[] = [1, 2, 3, 4, 5]
  ): Date[] {
    const dates: Date[] = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      if (workingDays.includes(current.getDay())) {
        dates.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  /**
   * Calcule la position d'un élément sur la timeline
   */
  static getTimelinePosition(
    startDate: Date, 
    endDate: Date, 
    timelineStart: Date, 
    timelineEnd: Date
  ): { left: string; width: string } {
    const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000))
    const startOffset = Math.ceil((startDate.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000))
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    
    const left = Math.max(0, (startOffset / totalDays) * 100)
    const width = Math.max(1, (duration / totalDays) * 100)
    
    return { left: `${left}%`, width: `${width}%` }
  }

  /**
   * Met à jour l'ordre des cartes
   */
  static updateCardOrder(cards: Card[], newOrder: string[]): Card[] {
    const cardMap = new Map(cards.map(card => [card.id, card]))
    const orderedCards: Card[] = []
    
    for (const cardId of newOrder) {
      const card = cardMap.get(cardId)
      if (card) {
        orderedCards.push(card)
      }
    }
    
    // Ajouter les cartes qui ne sont pas dans le nouvel ordre
    for (const card of cards) {
      if (!newOrder.includes(card.id)) {
        orderedCards.push(card)
      }
    }
    
    return orderedCards.map((card, index) => ({
      ...card,
      position: index
    }))
  }

  /**
   * Calcule les statistiques du projet
   */
  static calculateProjectStats(cards: Card[]): {
    totalEstimatedHours: number
    totalActualHours: number
    completedTasks: number
    totalTasks: number
    averageAccuracy: number
  } {
    const parentCards = cards.filter(card => !card.parentId)
    
    const totalEstimatedHours = parentCards.reduce((sum, card) => sum + (card.estimatedTime || 0), 0)
    const totalActualHours = parentCards.reduce((sum, card) => sum + (card.actualTime || 0), 0)
    const completedTasks = parentCards.filter(card => card.status === 'Done').length
    const totalTasks = parentCards.length
    
    // Calculer la précision moyenne (temps estimé vs temps réel)
    const cardsWithBothTimes = parentCards.filter(card => 
      card.estimatedTime && card.actualTime && card.actualTime > 0
    )
    
    const averageAccuracy = cardsWithBothTimes.length > 0 
      ? cardsWithBothTimes.reduce((sum, card) => {
          const accuracy = Math.abs((card.estimatedTime! - card.actualTime!) / card.estimatedTime!) * 100
          return sum + (100 - accuracy) // Plus c'est proche de 100%, mieux c'est
        }, 0) / cardsWithBothTimes.length
      : 0
    
    return {
      totalEstimatedHours,
      totalActualHours,
      completedTasks,
      totalTasks,
      averageAccuracy: Math.round(averageAccuracy)
    }
  }
}

export default TimelineService
