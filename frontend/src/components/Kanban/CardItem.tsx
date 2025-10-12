import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card } from '../../services/boardService'
import TimeTracker from '../TimeTracker/TimeTracker'

interface CardItemProps {
  card: Card
  index: number
  statusColor?: string
  boardColumns: string[]
  onEdit: (card: Card) => void
  onDelete: (cardId: string) => void
  onUpdate: () => void
  onEditSubtask: (subtask: Card) => void
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
}

function CardItem({ card, index, statusColor = '#93c5fd', boardColumns, onEdit, onDelete, onUpdate, onEditSubtask }: CardItemProps) {
  const [showSubtasks, setShowSubtasks] = useState(false)
  // Convertir la couleur hex en rgba pour le fond dégradé
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Calculer la progression des sous-tâches
  const subtasks = card.subtasks || []
  const completedSubtasks = subtasks.filter((st) => st.status === 'Done').length
  const totalSubtasks = subtasks.length
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(card)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      onDelete(card.id)
    }
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative rounded-lg shadow-sm p-4 mb-3 border-l-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-400 cursor-grabbing' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
            background: `linear-gradient(135deg, ${hexToRgba(statusColor, 0.1)} 0%, ${hexToRgba(statusColor, 0.05)} 100%)`,
            borderLeftColor: statusColor,
            borderRight: `1px solid ${hexToRgba(statusColor, 0.2)}`,
            borderTop: `1px solid ${hexToRgba(statusColor, 0.2)}`,
            borderBottom: `1px solid ${hexToRgba(statusColor, 0.2)}`,
          }}
        >
          {/* Titre - Clickable pour éditer */}
          <h3 
            className="font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            onClick={handleEdit}
          >
            {card.title}
          </h3>

          {/* Description - Clickable pour éditer */}
          {card.description && (
            <div 
              className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 cursor-pointer prose prose-sm dark:prose-invert max-w-none description-preview-compact"
              onClick={handleEdit}
              dangerouslySetInnerHTML={{ __html: card.description }}
            />
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            {/* Priorité */}
            <span className={`px-2 py-1 rounded-full font-medium ${priorityColors[card.priority]}`}>
              {priorityLabels[card.priority]}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Temps estimé */}
              {card.estimatedTime && (
                <span className="text-gray-500 dark:text-gray-400">
                  ⏱️ {card.estimatedTime}h
                </span>
              )}

              {/* Assigné */}
              {card.assignee && (
                <span className="text-gray-500 dark:text-gray-400">👤 {card.assignee}</span>
              )}

              {/* Bouton supprimer */}
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 ml-2"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Date limite */}
          {card.dueDate && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              📅 Échéance: {new Date(card.dueDate).toLocaleDateString('fr-FR')}
            </div>
          )}

          {/* Time Tracker compact */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <TimeTracker cardId={card.id} compact={true} onTimeUpdate={onUpdate} />
          </div>

          {/* Progress bar des sous-tâches - Cliquable */}
          {totalSubtasks > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 py-2 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSubtasks(!showSubtasks)
                }}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {showSubtasks ? '▼' : '▶'} Sous-tâches
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {completedSubtasks}/{totalSubtasks} ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-secondary-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Liste déroulante des sous-tâches */}
              {showSubtasks && (
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto px-2">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditSubtask(subtask)
                      }}
                    >
                      {/* Indicateur de statut */}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        subtask.status === 'Done' 
                          ? 'bg-secondary-600' 
                          : 'bg-gray-400 dark:bg-gray-500'
                      }`} />

                      {/* Titre de la sous-tâche */}
                      <span
                        className={`flex-1 text-xs ${
                          subtask.status === 'Done'
                            ? 'line-through text-gray-500 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {subtask.title}
                      </span>

                      {/* Badge de statut */}
                      <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {subtask.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default CardItem

