import { useState, useEffect } from 'react'
import { Board, Card, cardService, CreateCardData, UpdateCardData, subtaskService } from '../../services/boardService'
import SubTaskList from './SubTaskList'
import DescriptionEditor from '../Common/DescriptionEditor'
import DetailsPanel from '../Card/DetailsPanel'
import CommentsTab from '../Card/CommentsTab'
import HistoryTab from '../Card/HistoryTab'
import TimeTracker from '../TimeTracker/TimeTracker'

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

function CardModalNew({ card, board, defaultStatus, parentCardId, isSubtaskModal = false, onSave, onClose, onOpenSubtaskModal }: CardModalProps) {
  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    status: card?.status || defaultStatus || board.columns[0] || 'To Do',
    priority: card?.priority || 'medium',
    assignee: card?.assignee || '',
    reporter: card?.reporter || '',
    category: card?.category || '',
    labels: card?.labels || [],
    estimatedTime: card?.estimatedTime?.toString() || '',
    actualTime: card?.actualTime?.toString() || '',
    startDate: card?.startDate ? card.startDate.split('T')[0] : '',
    dueDate: card?.dueDate ? card.dueDate.split('T')[0] : '',
  })

  const [currentCard, setCurrentCard] = useState(card)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments')

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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        reporter: formData.reporter.trim() || undefined,
        category: formData.category || undefined,
        labels: formData.labels.length > 0 ? formData.labels : undefined,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
        actualTime: formData.actualTime ? parseInt(formData.actualTime) : undefined,
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined,
      }

      if (card) {
        // Mise à jour
        if (card.parentId || parentCardId) {
          await subtaskService.update(card.id, data)
        } else {
          await cardService.update(card.id, data)
        }
      } else {
        // Création
        if (parentCardId) {
          await subtaskService.create(parentCardId, data as any)
        } else {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Erreur */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Contenu - 2 colonnes */}
        <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          {/* Colonne gauche */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Titre */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Titre de la carte"
                className="w-full px-4 py-3 text-xl font-semibold border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:border-secondary-300 focus:outline-none"
                required
              />
            </div>

            {/* Statut rapide (visible) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Dans</span>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="text-sm font-semibold bg-transparent border-0 text-gray-900 dark:text-white cursor-pointer focus:outline-none"
              >
                {board.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                📝 Description
              </label>
              <DescriptionEditor
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                placeholder="Ajouter une description détaillée..."
              />
            </div>

            {/* Time Tracker (seulement pour les cartes existantes) */}
            {currentCard && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30">
                <TimeTracker cardId={currentCard.id} onTimeUpdate={refreshCard} />
              </div>
            )}

            {/* Sous-tâches (seulement pour les cartes principales) */}
            {currentCard && !currentCard.parentId && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  ✅ Sous-tâches
                </label>
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

            {/* Onglets (seulement pour les cartes existantes) */}
            {currentCard && (
              <div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('comments')}
                      className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'comments'
                          ? 'border-secondary-300 text-secondary-600 dark:text-secondary-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      💬 Commentaires {currentCard.comments && `(${currentCard.comments.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'history'
                          ? 'border-secondary-300 text-secondary-600 dark:text-secondary-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      📜 Historique {currentCard.history && `(${currentCard.history.length})`}
                    </button>
                  </nav>
                </div>

                <div className="mt-4">
                  {activeTab === 'comments' && (
                    <CommentsTab
                      cardId={currentCard.id}
                      comments={currentCard.comments || []}
                      onUpdate={refreshCard}
                    />
                  )}
                  {activeTab === 'history' && (
                    <HistoryTab history={currentCard.history || []} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Détails */}
          <div className="w-80 p-6 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <DetailsPanel
              cardId={currentCard?.id}
              formData={formData}
              boardColumns={board.columns}
              onChange={handleChange}
            />
          </div>
        </form>

        {/* Footer avec boutons d'action */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : card ? 'Mettre à jour' : 'Créer la carte'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModalNew

