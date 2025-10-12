import { useState, useEffect } from 'react'
import { Card, subtaskService } from '../../services/boardService'

interface SubTaskListProps {
  parentCard: Card
  boardColumns: string[]
  onUpdate: () => void
  onEditSubtask: (subtask: Card) => void
  onCreateSubtask: () => void
}

function SubTaskList({ parentCard, boardColumns, onUpdate, onEditSubtask, onCreateSubtask }: SubTaskListProps) {
  const [subtasks, setSubtasks] = useState<Card[]>(parentCard.subtasks || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSubtasks(parentCard.subtasks || [])
  }, [parentCard.subtasks])

  // Calculer la progression
  const completedCount = subtasks.filter((st) => st.status === 'Done').length
  const totalCount = subtasks.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Supprimer une sous-tâche
  const handleDelete = async (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Supprimer cette sous-tâche ?')) return

    try {
      setLoading(true)
      await subtaskService.delete(subtaskId)
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Progression des sous-tâches
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {completedCount}/{totalCount} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-secondary-300 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Bouton pour ajouter une sous-tâche */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onCreateSubtask()
        }}
        disabled={loading}
        className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-secondary-300 hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/10 transition-colors"
      >
        ➕ Ajouter une sous-tâche
      </button>

      {/* Liste des sous-tâches */}
      {subtasks.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onEditSubtask(subtask)
              }}
            >
              {/* Indicateur de statut coloré */}
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                subtask.status === 'Done' 
                  ? 'bg-secondary-600' 
                  : 'bg-gray-400 dark:bg-gray-500'
              }`} />

              {/* Titre */}
              <span
                className={`flex-1 text-sm ${
                  subtask.status === 'Done'
                    ? 'line-through text-gray-500 dark:text-gray-500'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {subtask.title}
              </span>

              {/* Badge de statut */}
              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded flex-shrink-0">
                {subtask.status}
              </span>

              {/* Action de suppression */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDelete(subtask.id, e)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-1"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucune sous-tâche */}
      {subtasks.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
          Aucune sous-tâche. Cliquez sur le bouton ci-dessus pour en ajouter.
        </p>
      )}
    </div>
  )
}

export default SubTaskList
