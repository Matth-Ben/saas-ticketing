import React, { useState, useEffect, useMemo } from 'react'
import { Board, Card } from '../../services/boardService'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { TimelineService, defaultTimelineSettings, TimelineSettings } from '../../services/timelineService'
import TimelineSettingsModal from './TimelineSettings'

interface TimelineViewProps {
  board: Board
  onUpdateCards: (cards: Card[]) => void
}

interface TimelineCard extends Card {
  subtasks?: Card[]
  calculatedStartDate?: Date
  calculatedEndDate?: Date
  isExpanded?: boolean
}

interface DateRange {
  start: Date
  end: Date
}

const TimelineView: React.FC<TimelineViewProps> = ({ board, onUpdateCards }) => {
  const [timelineCards, setTimelineCards] = useState<TimelineCard[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null)
  const [settings, setSettings] = useState(defaultTimelineSettings)
  const [showSettings, setShowSettings] = useState(false)

  // Calculer la plage de dates à afficher
  const dateRange = useMemo(() => {
    if (selectedDateRange) return selectedDateRange
    
    const allDates = timelineCards.flatMap(card => [
      card.calculatedStartDate,
      card.calculatedEndDate,
      card.startDate,
      card.dueDate
    ]).filter((date): date is Date => date instanceof Date && !isNaN(date.getTime()))
    
    if (allDates.length === 0) {
      const today = new Date()
      return {
        start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      }
    }
    
    const minTimestamp = Math.min(...allDates.map(d => d.getTime()))
    const maxTimestamp = Math.max(...allDates.map(d => d.getTime()))
    
    return {
      start: new Date(minTimestamp - 7 * 24 * 60 * 60 * 1000),
      end: new Date(maxTimestamp + 7 * 24 * 60 * 60 * 1000)
    }
  }, [timelineCards.length, selectedDateRange])

  // Calculer les dates prévisionnelles pour chaque ticket
  const calculateTimelineDates = (cards: Card[]): TimelineCard[] => {
    // Séparer les tickets parents et les sous-tâches
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

    // Calculer les dates pour chaque ticket parent
    let currentDate = new Date(dateRange.start.getTime())
    
    return parentCards.map((card, index) => {
      const subtasks = subtasksByParent[card.id] || []
      const estimatedTime = card.estimatedTime || 0
      const actualTime = card.actualTime || 0
      
      // Utiliser le temps réel s'il existe, sinon l'estimé
      const timeToUse = actualTime > 0 ? actualTime : estimatedTime
      
      // Calculer la date de fin basée sur le temps
      const workDays = Math.ceil(timeToUse / settings.workHoursPerDay)
      const endDate = TimelineService.addWorkingDays(new Date(currentDate.getTime()), workDays, settings.workingDays)
      
      const timelineCard: TimelineCard = {
        ...card,
        subtasks: subtasks.map(subtask => ({
          ...subtask,
          calculatedStartDate: new Date(currentDate.getTime()),
          calculatedEndDate: TimelineService.addWorkingDays(new Date(currentDate.getTime()), Math.ceil((subtask.estimatedTime || 0) / settings.workHoursPerDay), settings.workingDays)
        })),
        calculatedStartDate: new Date(currentDate.getTime()),
        calculatedEndDate: new Date(endDate.getTime()),
        isExpanded: false
      }
      
      // Passer à la date suivante pour le prochain ticket
      currentDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
      
      return timelineCard
    })
  }

  // Générer les dates à afficher dans le calendrier
  const calendarDates = useMemo(() => 
    TimelineService.generateCalendarDates(dateRange.start, dateRange.end, settings.workingDays), 
    [dateRange.start.getTime(), dateRange.end.getTime(), settings.workingDays.join(',')]
  )

  useEffect(() => {
    const allCards = [...board.cards]
    const calculatedCards = calculateTimelineDates(allCards)
    setTimelineCards(calculatedCards)
  }, [board.cards.length, dateRange.start.getTime(), dateRange.end.getTime()])

  // Gérer le drag & drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    
    const newCards = Array.from(timelineCards)
    const [reorderedItem] = newCards.splice(result.source.index, 1)
    newCards.splice(result.destination.index, 0, reorderedItem)
    
    // Recalculer les positions et les dates
    const updatedCards = newCards.map((card, index) => ({
      ...card,
      position: index
    }))
    
    setTimelineCards(updatedCards)
    onUpdateCards(updatedCards)
  }

  // Toggle l'expansion des sous-tâches
  const toggleSubtasks = (cardId: string) => {
    setTimelineCards(cards =>
      cards.map(card =>
        card.id === cardId
          ? { ...card, isExpanded: !card.isExpanded }
          : card
      )
    )
  }

  // Calculer la position d'un élément sur la timeline
  const getTimelinePosition = useMemo(() => (startDate: Date, endDate: Date) => {
    return TimelineService.getTimelinePosition(startDate, endDate, dateRange.start, dateRange.end)
  }, [dateRange.start.getTime(), dateRange.end.getTime()])

  // Formater une date pour l'affichage
  const formatDate = useMemo(() => (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }, [])

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* En-tête avec contrôles */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Timeline - {board.name}
          </h2>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDateRange(prev => ({
                start: new Date(e.target.value),
                end: prev?.end || new Date()
              }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
            />
            <span className="text-gray-500 dark:text-gray-400">à</span>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDateRange(prev => ({
                start: prev?.start || new Date(),
                end: new Date(e.target.value)
              }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
            />
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Paramètres de la timeline"
            >
              ⚙️
            </button>
          </div>
        </div>
        
        {/* Légende */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Temps estimé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Temps réel</span>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Liste des tickets */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Tickets ({timelineCards.length})
              </h3>
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="timeline-tickets">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {timelineCards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                p-3 rounded-lg border cursor-move transition-colors
                                ${snapshot.isDragging 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }
                                hover:bg-gray-50 dark:hover:bg-gray-700
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                      {card.key}
                                    </span>
                                    <span className={`
                                      px-2 py-1 text-xs rounded-full
                                      ${card.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                        card.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'}
                                    `}>
                                      {card.priority}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {card.title}
                                  </h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {card.estimatedTime && (
                                      <span>Est: {card.estimatedTime}h</span>
                                    )}
                                    {card.actualTime && card.actualTime > 0 && (
                                      <span className="ml-2">Réel: {card.actualTime}h</span>
                                    )}
                                  </div>
                                </div>
                                
                                {card.subtasks && card.subtasks.length > 0 && (
                                  <button
                                    onClick={() => toggleSubtasks(card.id)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  >
                                    {card.isExpanded ? '▼' : '▶'}
                                  </button>
                                )}
                              </div>
                              
                              {/* Sous-tâches */}
                              {card.isExpanded && card.subtasks && card.subtasks.length > 0 && (
                                <div className="mt-3 ml-4 space-y-2">
                                  {card.subtasks.map(subtask => (
                                    <div key={subtask.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                      <div className="font-medium text-gray-800 dark:text-gray-200">
                                        {subtask.key} - {subtask.title}
                                      </div>
                                      <div className="text-gray-500 dark:text-gray-400">
                                        {subtask.estimatedTime && `${subtask.estimatedTime}h`}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          {/* Calendrier/Timeline */}
          <div className="flex-1 overflow-x-auto">
            <div className="p-4">
              {/* En-tête du calendrier */}
              <div className="flex mb-4">
                <div className="w-80 flex-shrink-0"></div>
                <div className="flex-1 flex">
                  {calendarDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline des tickets */}
              <div className="space-y-4">
                {timelineCards.map((card, index) => {
                  const startDate = card.calculatedStartDate || (card.startDate ? new Date(card.startDate) : new Date())
                  const endDate = card.calculatedEndDate || (card.dueDate ? new Date(card.dueDate) : new Date())
                  const position = getTimelinePosition(startDate, endDate)
                  
                  return (
                    <div key={card.id} className="relative">
                      {/* Barre de progression du ticket */}
                      <div
                        className="h-8 rounded flex items-center px-2 text-xs font-medium text-white relative"
                        style={{
                          left: position.left,
                          width: position.width,
                          backgroundColor: card.actualTime && card.actualTime > 0 
                            ? '#10b981' // Vert pour temps réel
                            : '#3b82f6' // Bleu pour temps estimé
                        }}
                      >
                        <span className="truncate">
                          {card.key} - {card.title}
                        </span>
                        
                        {/* Indicateur de statut */}
                        <div className={`
                          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                          ${card.status === 'Done' ? 'bg-green-500' :
                            card.status === 'In Progress' ? 'bg-yellow-500' :
                            'bg-gray-400'}
                        `}></div>
                      </div>

                      {/* Sous-tâches */}
                      {card.isExpanded && card.subtasks && card.subtasks.map(subtask => {
                        const subtaskStart = subtask.calculatedStartDate || (subtask.startDate ? new Date(subtask.startDate) : startDate)
                        const subtaskEnd = subtask.calculatedEndDate || (subtask.dueDate ? new Date(subtask.dueDate) : endDate)
                        const subtaskPosition = getTimelinePosition(subtaskStart, subtaskEnd)
                        
                        return (
                          <div
                            key={subtask.id}
                            className="h-6 rounded flex items-center px-2 text-xs font-medium text-white ml-4 mt-1"
                            style={{
                              left: subtaskPosition.left,
                              width: subtaskPosition.width,
                              backgroundColor: '#6b7280' // Gris pour sous-tâches
                            }}
                          >
                            <span className="truncate">
                              {subtask.key} - {subtask.title}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de paramètres */}
      {showSettings && (
        <TimelineSettingsModal
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default TimelineView
