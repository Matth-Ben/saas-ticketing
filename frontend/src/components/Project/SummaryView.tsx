import { useState, useEffect } from 'react'
import { Board, Card } from '../../services/boardService'
import { timeService, TimeEntry } from '../../services/timeService'
import ProfitabilityChart from '../Quote/ProfitabilityChart'

interface SummaryViewProps {
  board: Board
  cards: Card[]
}

function SummaryView({ board, cards }: SummaryViewProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Charger toutes les TimeEntries du board
  useEffect(() => {
    loadAllTimeEntries()
  }, [board.id, cards])

  const loadAllTimeEntries = async () => {
    try {
      setLoading(true)
      const allEntries: TimeEntry[] = []
      
      // Charger les TimeEntries pour chaque carte
      for (const card of cards) {
        try {
          const entries = await timeService.getByCard(card.id)
          allEntries.push(...entries)
        } catch (err) {
          console.error(`Failed to load time entries for card ${card.id}:`, err)
        }
      }
      
      setTimeEntries(allEntries)
    } catch (err) {
      console.error('Failed to load time entries:', err)
    } finally {
      setLoading(false)
    }
  }

  // Statistiques
  const totalCards = cards.length
  const completedCards = cards.filter((c) => c.status === 'Done').length
  const inProgressCards = cards.filter((c) => c.status === 'In Progress').length
  const todoCards = cards.filter((c) => c.status === 'To Do').length
  
  // Calcul du temps
  const totalEstimatedTime = cards.reduce((sum, c) => sum + (c.estimatedTime || 0), 0)
  
  // Calcul du temps réel depuis les TimeEntries (en minutes)
  const totalActualMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
  const totalActualTime = Math.round((totalActualMinutes / 60) * 10) / 10 // Convertir en heures
  
  // Nombre de sessions
  const totalSessions = timeEntries.length
  
  // Cartes par priorité
  const highPriority = cards.filter((c) => c.priority === 'high').length
  const mediumPriority = cards.filter((c) => c.priority === 'medium').length
  const lowPriority = cards.filter((c) => c.priority === 'low').length
  
  // Cartes par catégorie
  const categories = cards.reduce((acc, card) => {
    const cat = card.category || 'Sans catégorie'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Progression globale
  const progress = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{board.name}</h1>
        {board.description && (
          <p className="text-gray-600 dark:text-gray-400">{board.description}</p>
        )}
      </div>

      {/* Progression globale */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Progression du projet</h2>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-secondary-300 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-semibold text-primary-900"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && `${progress}%`}
              </div>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress}%
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {completedCards} tâches terminées sur {totalCards}
        </p>
      </div>

      {/* Statistiques par statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">À faire</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todoCards}</p>
        </div>

        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">En cours</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressCards}</p>
        </div>

        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Terminé</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCards}</p>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priorités */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Répartition par priorité</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🔴 Haute</span>
              <span className="font-semibold text-gray-900 dark:text-white">{highPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🟡 Moyenne</span>
              <span className="font-semibold text-gray-900 dark:text-white">{mediumPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🔵 Basse</span>
              <span className="font-semibold text-gray-900 dark:text-white">{lowPriority}</span>
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Répartition par catégorie</h2>
          <div className="space-y-3">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suivi temporel */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">⏱️ Suivi temporel</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Chargement des données temporelles...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temps estimé</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEstimatedTime}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temps passé</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalActualTime}h
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {timeService.formatDuration(totalActualMinutes)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  enregistrée{totalSessions > 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Écart</p>
                <p className={`text-2xl font-bold ${
                  totalActualTime > totalEstimatedTime 
                    ? 'text-red-600 dark:text-red-400' 
                    : totalActualTime === 0
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {totalActualTime === 0 ? '—' : (
                    <>
                      {totalActualTime > totalEstimatedTime ? '+' : ''}
                      {(totalActualTime - totalEstimatedTime).toFixed(1)}h
                    </>
                  )}
                </p>
                {totalEstimatedTime > 0 && totalActualTime > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((totalActualTime / totalEstimatedTime) * 100)}% du temps estimé
                  </p>
                )}
              </div>
            </div>

            {/* Barre de progression du temps */}
            {totalEstimatedTime > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progression temporelle
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {totalActualTime}h / {totalEstimatedTime}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      totalActualTime > totalEstimatedTime
                        ? 'bg-red-500'
                        : 'bg-secondary-300'
                    }`}
                    style={{ width: `${Math.min((totalActualTime / totalEstimatedTime) * 100, 100)}%` }}
                  />
                </div>
                {totalActualTime > totalEstimatedTime && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ⚠️ Dépassement de {(totalActualTime - totalEstimatedTime).toFixed(1)}h
                  </p>
                )}
              </div>
            )}

            {/* Top 5 des cartes par temps passé */}
            {timeEntries.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Top 5 - Cartes par temps passé
                </h3>
                <div className="space-y-2">
                  {Object.entries(
                    timeEntries.reduce((acc, entry) => {
                      const cardId = entry.cardId
                      acc[cardId] = (acc[cardId] || 0) + (entry.duration || 0)
                      return acc
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([cardId, minutes]) => {
                      const card = cards.find((c) => c.id === cardId)
                      if (!card) return null
                      
                      return (
                        <div
                          key={cardId}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                              {card.key}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white truncate">
                              {card.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {timeService.formatDuration(minutes)}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {(minutes / 60).toFixed(1)}h
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {totalSessions === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucune session de temps enregistrée pour ce projet.
              </div>
            )}
          </>
        )}
      </div>

      {/* Dernières activités */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">📋 Dernières tâches</h2>
        <div className="space-y-2">
          {cards
            .slice(0, 5)
            .map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {card.key}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {card.title}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                  {card.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Graphique de rentabilité */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">💰 Rentabilité des Devis</h2>
        <ProfitabilityChart board={board} />
      </div>
    </div>
  )
}

export default SummaryView

