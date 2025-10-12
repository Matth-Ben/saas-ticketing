import { History } from '../../services/boardService'

interface HistoryTabProps {
  history: History[]
}

function HistoryTab({ history }: HistoryTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return '➕'
      case 'updated':
        return '✏️'
      case 'moved':
        return '↔️'
      case 'status_changed':
        return '🔄'
      case 'deleted':
        return '🗑️'
      default:
        return '📝'
    }
  }

  const getActionText = (entry: History) => {
    const { action, field, oldValue, newValue } = entry

    switch (action) {
      case 'created':
        return 'a créé cette carte'
      case 'updated':
        if (field && oldValue && newValue) {
          return `a modifié ${field} : "${oldValue}" → "${newValue}"`
        }
        return `a modifié ${field || 'la carte'}`
      case 'moved':
        return `a déplacé la carte de "${oldValue}" vers "${newValue}"`
      case 'status_changed':
        return `a changé le statut de "${oldValue}" à "${newValue}"`
      default:
        return action
    }
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          {/* Icône d'action */}
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg flex-shrink-0">
            {getActionIcon(entry.action)}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-white">
              <span className="font-semibold">{entry.user}</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {getActionText(entry)}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatDate(entry.createdAt)}
            </p>
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 italic">
          Aucun historique disponible
        </p>
      )}
    </div>
  )
}

export default HistoryTab

