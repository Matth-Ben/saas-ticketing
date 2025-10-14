import { useState, useEffect } from 'react'
import { Board, Card, boardService } from '../services/boardService'
import ProjectView from '../components/Project/ProjectView'
import ColumnManager from '../components/Kanban/ColumnManager'
import CardModalNew from '../components/Kanban/CardModalNew'

function Boards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewBoardForm, setShowNewBoardForm] = useState(false)
  const [showColumnManager, setShowColumnManager] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  
  // Modal de carte depuis la vue Liste
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  useEffect(() => {
    loadBoards()
  }, [])

  const loadBoards = async () => {
    try {
      setLoading(true)
      const data = await boardService.getAll()
      setBoards(data)
      
      // Sélectionner le premier board par défaut
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim()) return

    try {
      const newBoard = await boardService.create({
        name: newBoardName.trim(),
      })
      setBoards([newBoard, ...boards])
      setSelectedBoard(newBoard)
      setNewBoardName('')
      setShowNewBoardForm(false)
    } catch (error) {
      console.error('Erreur lors de la création du board:', error)
    }
  }

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tableau ?')) {
      return
    }

    try {
      await boardService.delete(boardId)
      const updatedBoards = boards.filter((b) => b.id !== boardId)
      setBoards(updatedBoards)
      
      // Sélectionner un autre board
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(updatedBoards[0] || null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const refreshBoard = async () => {
    if (selectedBoard) {
      try {
        const updatedBoard = await boardService.getById(selectedBoard.id)
        setSelectedBoard(updatedBoard)
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error)
      }
    }
  }

  const handleColumnUpdate = (updatedBoard: Board) => {
    setSelectedBoard(updatedBoard)
    // Mettre à jour aussi dans la liste des boards
    setBoards(boards.map(b => b.id === updatedBoard.id ? updatedBoard : b))
  }

  // Ouvrir le modal de carte depuis la vue Liste
  const handleEditCardFromList = (card: Card) => {
    setSelectedCard(card)
    setIsCardModalOpen(true)
  }

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false)
    setSelectedCard(null)
  }

  const handleSaveCard = async () => {
    await refreshBoard()
    handleCloseCardModal()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="h-full max-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedBoard ? selectedBoard.name : "Projets"}
          </h1>
          
          <div className="flex gap-2">
            {selectedBoard && (
              <button
                onClick={() => setShowColumnManager(true)}
                className="btn-secondary"
                title="Gérer les colonnes"
              >
                ⚙️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        {boards.length === 0 ? (
          <div className="card text-center py-12 m-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aucun projet créé. Créez votre premier projet pour commencer !
            </p>
            <button
              onClick={() => setShowNewBoardForm(true)}
              className="btn-primary"
            >
              ➕ Créer un projet
            </button>
          </div>
        ) : selectedBoard ? (
          <ProjectView 
            board={selectedBoard} 
            onRefresh={refreshBoard}
            onEditCard={handleEditCardFromList}
          />
        ) : (
          <div className="card text-center py-12 m-6">
            <p className="text-gray-600 dark:text-gray-400">
              Sélectionnez un projet pour commencer
            </p>
          </div>
        )}
      </div>

      {/* Modal de création de board */}
      {showNewBoardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nouveau tableau
            </h2>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Nom du tableau"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewBoardForm(false)
                    setNewBoardName('')
                  }}
                  className="flex-1 btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de gestion des colonnes */}
      {showColumnManager && selectedBoard && (
        <ColumnManager
          board={selectedBoard}
          onUpdate={handleColumnUpdate}
          onClose={() => setShowColumnManager(false)}
        />
      )}

      {/* Modal de carte (depuis la vue Liste) */}
      {isCardModalOpen && selectedBoard && selectedCard && (
        <CardModalNew
          card={selectedCard}
          board={selectedBoard}
          onSave={handleSaveCard}
          onClose={handleCloseCardModal}
        />
      )}
    </div>
  )
}

export default Boards

