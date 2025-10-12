import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Board, Card, cardService } from '../../services/boardService'
import Column from './Column'
import CardModalNew from './CardModalNew'

interface KanbanBoardProps {
  board: Board
  onRefresh: () => void
}

function KanbanBoard({ board, onRefresh }: KanbanBoardProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [selectedSubtask, setSelectedSubtask] = useState<Card | null>(null)
  const [parentCardForSubtask, setParentCardForSubtask] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false)
  const [newCardStatus, setNewCardStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Charger les cartes
  useEffect(() => {
    loadCards()
  }, [board.id, searchTerm, priorityFilter])

  const loadCards = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (searchTerm) filters.search = searchTerm
      if (priorityFilter) filters.priority = priorityFilter

      const data = await cardService.getByBoard(board.id, filters)
      setCards(data)
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Gérer le drag & drop
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    // Pas de destination ou même position
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return
    }

    // Trouver la carte déplacée
    const card = cards.find((c) => c.id === draggableId)
    if (!card) return

    const newStatus = destination.droppableId
    const newPosition = destination.index

    // Mise à jour optimiste
    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, status: newStatus, position: newPosition } : c
    )
    setCards(updatedCards)

    try {
      // Synchroniser avec le backend
      await cardService.move(card.id, {
        status: newStatus,
        position: newPosition,
      })
      // Recharger pour avoir les données à jour
      await loadCards()
    } catch (error) {
      console.error('Erreur lors du déplacement de la carte:', error)
      // Restaurer l'état précédent en cas d'erreur
      setCards(cards)
    }
  }

  // Grouper les cartes par statut
  const getCardsByStatus = (status: string) => {
    return cards
      .filter((card) => card.status === status)
      .sort((a, b) => a.position - b.position)
  }

  // Ouvrir le modal pour créer/éditer une carte normale
  const handleOpenModal = (card?: Card, status?: string) => {
    setSelectedCard(card || null)
    setNewCardStatus(status || '')
    setIsModalOpen(true)
  }

  // Ouvrir le modal pour une sous-tâche depuis le Kanban
  const handleEditSubtask = (subtask: Card) => {
    setSelectedSubtask(subtask)
    setParentCardForSubtask(subtask.parentId || null)
    setIsSubtaskModalOpen(true)
  }

  // Ouvrir le modal pour créer/éditer une sous-tâche depuis le modal parent
  const handleOpenSubtaskModal = (subtask: Card | null, parentId: string) => {
    setSelectedSubtask(subtask)
    setParentCardForSubtask(parentId)
    setIsSubtaskModalOpen(true)
  }

  // Fermer le modal principal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
    setNewCardStatus('')
  }

  // Fermer le modal de sous-tâche
  const handleCloseSubtaskModal = () => {
    setIsSubtaskModalOpen(false)
    setSelectedSubtask(null)
    setParentCardForSubtask(null)
  }

  // Sauvegarder une sous-tâche
  const handleSaveSubtask = async () => {
    try {
      await loadCards()
      // Rafraîchir la carte parent pour afficher la nouvelle sous-tâche
      if (selectedCard && !selectedCard.parentId) {
        const updatedCard = await cardService.getById(selectedCard.id)
        setSelectedCard(updatedCard)
      } else if (parentCardForSubtask) {
        // Si on édite une sous-tâche, rafraîchir la carte parent
        const parentCard = await cardService.getById(parentCardForSubtask)
        setSelectedCard(parentCard)
      }
      handleCloseSubtaskModal()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  // Sauvegarder la carte
  const handleSaveCard = async () => {
    await loadCards()
    handleCloseModal()
  }

  // Supprimer une carte
  const handleDeleteCard = async (cardId: string) => {
    try {
      await cardService.delete(cardId)
      await loadCards()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Rechercher une carte..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Toutes les priorités</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('')
            setPriorityFilter('')
          }}
          className="btn-secondary"
        >
          Réinitialiser
        </button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {board.columns.map((column) => (
              <Column
                key={column}
                title={column}
                color={board.columnColors?.[column] || '#93c5fd'}
                cards={getCardsByStatus(column)}
                boardColumns={board.columns}
                onEdit={handleOpenModal}
                onDelete={handleDeleteCard}
                onAddCard={(status) => handleOpenModal(undefined, status)}
                onUpdate={loadCards}
                onEditSubtask={handleEditSubtask}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modal de création/édition de carte */}
      {isModalOpen && (
        <CardModalNew
          card={selectedCard}
          board={board}
          defaultStatus={newCardStatus || board.columns[0]}
          onSave={handleSaveCard}
          onClose={handleCloseModal}
          onOpenSubtaskModal={handleOpenSubtaskModal}
        />
      )}

      {/* Modal de création/édition de sous-tâche (par-dessus le modal parent) */}
      {isSubtaskModalOpen && (
        <CardModalNew
          card={selectedSubtask}
          board={board}
          defaultStatus={board.columns[0]}
          parentCardId={parentCardForSubtask}
          isSubtaskModal={true}
          onSave={handleSaveSubtask}
          onClose={handleCloseSubtaskModal}
        />
      )}
    </div>
  )
}

export default KanbanBoard

