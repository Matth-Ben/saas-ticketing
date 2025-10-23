import React from 'react'
import { Card } from '../../services/boardService'
import { TimelineService } from '../../services/timelineService'

interface TimelineStatsProps {
  cards: Card[]
}

const TimelineStats: React.FC<TimelineStatsProps> = ({ cards }) => {
  const stats = TimelineService.calculateProjectStats(cards)
  
  const formatHours = (hours: number) => {
    if (hours === 0) return '0h'
    if (hours < 1) return `${Math.round(hours * 60)}min`
    if (hours === Math.floor(hours)) return `${hours}h`
    return `${Math.floor(hours)}h${Math.round((hours % 1) * 60)}min`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400'
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressPercentage = () => {
    return stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📊 Statistiques du projet
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progression */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getProgressPercentage()}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Progression
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {stats.completedTasks}/{stats.totalTasks} tâches
          </div>
        </div>

        {/* Temps estimé */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatHours(stats.totalEstimatedHours)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Temps estimé
          </div>
        </div>

        {/* Temps réel */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatHours(stats.totalActualHours)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Temps réel
          </div>
        </div>

        {/* Précision */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getAccuracyColor(stats.averageAccuracy)}`}>
            {stats.averageAccuracy}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Précision
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Estimé vs Réel
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progression globale</span>
          <span>{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Analyse des écarts */}
      {stats.totalActualHours > 0 && stats.totalEstimatedHours > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            📈 Analyse des écarts
          </h4>
          
          {(() => {
            const timeDifference = stats.totalActualHours - stats.totalEstimatedHours
            const percentageDifference = Math.round((timeDifference / stats.totalEstimatedHours) * 100)
            
            if (timeDifference > 0) {
              return (
                <div className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ Le projet a pris <strong>{formatHours(Math.abs(timeDifference))}</strong> de plus que prévu 
                  ({percentageDifference}% de retard)
                </div>
              )
            } else if (timeDifference < 0) {
              return (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✅ Le projet a été terminé <strong>{formatHours(Math.abs(timeDifference))}</strong> plus tôt que prévu 
                  ({Math.abs(percentageDifference)}% d'avance)
                </div>
              )
            } else {
              return (
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  🎯 Le projet a été terminé exactement dans les temps prévus
                </div>
              )
            }
          })()}
        </div>
      )}
    </div>
  )
}

export default TimelineStats
