import { useState, useEffect } from 'react'
import { Board, Card, cardService, CreateCardData, UpdateCardData, subtaskService } from '../../services/boardService'
import SubTaskList from './SubTaskList'
import DescriptionEditor from '../Common/DescriptionEditor'

interface CardModalProps {
  card?: Card | null
  board: Board
  defaultStatus?: string
  parentCardId?: string | null
  isSubtaskModal?: boolean
  onSave: () => void
  onClose: () => void
  onOpenSubtaskModal?: (subtask: Card | null, parentId: string) => void
}

function CardModal({ card, board, defaultStatus, parentCardId, isSubtaskModal = false, onSave, onClose, onOpenSubtaskModal }: CardModalProps) {
  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    status: card?.status || defaultStatus || board.columns[0] || 'To Do',
    priority: card?.priority || 'medium',
    assignee: card?.assignee || '',
    estimatedTime: card?.estimatedTime?.toString() || '',
    dueDate: card?.dueDate ? card.dueDate.split('T')[0] : '',
  })

  const [currentCard, setCurrentCard] = useState(card)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mettre à jour currentCard quand card change (après rafraîchissement)
  useEffect(() => {
    setCurrentCard(card)
  }, [card])

  // Rafraîchir la carte pour obtenir les sous-tâches mises à jour
  const refreshCard = async () => {
    if (card) {
      try {
        const updatedCard = await cardService.getById(card.id)
        setCurrentCard(updatedCard)
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Le titre est requis')
      return
    }

    try {
      setLoading(true)

      const data: CreateCardData | UpdateCardData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority as 'low' | 'medium' | 'high',
        assignee: formData.assignee.trim() || undefined,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
        dueDate: formData.dueDate || undefined,
      }

      if (card) {
        // Mise à jour
        if (card.parentId || parentCardId) {
          // Mise à jour d'une sous-tâche
          await subtaskService.update(card.id, data)
        } else {
          // Mise à jour d'une carte normale
          await cardService.update(card.id, data)
        }
      } else {
        // Création
        if (parentCardId) {
          // Création d'une sous-tâche
          await subtaskService.create(parentCardId, data as any)
        } else {
          // Création d'une carte normale
          await cardService.create({
            ...data,
            boardId: board.id,
          } as CreateCardData)
        }
      }

      onSave()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 bg-black ${isSubtaskModal ? 'bg-opacity-30 z-[60]' : 'bg-opacity-50 z-50'} flex items-center justify-center p-4`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {card?.parentId || parentCardId 
              ? (card ? 'Éditer la sous-tâche' : 'Nouvelle sous-tâche')
              : (card ? 'Éditer la carte' : 'Nouvelle carte')
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Erreur */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <DescriptionEditor
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Ajouter une description détaillée..."
            />
          </div>

          {/* Ligne 1: Statut et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {board.columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>

          {/* Ligne 2: Assigné et Temps estimé */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigné à
              </label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="Nom de la personne"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temps estimé (heures)
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="Ex: 5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Date limite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date limite
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sous-tâches (seulement pour les cartes existantes et non-sous-tâches) */}
          {currentCard && !currentCard.parentId && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Sous-tâches
              </h3>
              <SubTaskList
                parentCard={currentCard}
                boardColumns={board.columns}
                onUpdate={refreshCard}
                onEditSubtask={(subtask) => {
                  if (onOpenSubtaskModal) {
                    onOpenSubtaskModal(subtask, currentCard.id)
                  }
                }}
                onCreateSubtask={() => {
                  if (onOpenSubtaskModal) {
                    onOpenSubtaskModal(null, currentCard.id)
                  }
                }}
              />
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : card ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CardModal

