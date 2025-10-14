import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Board, boardService } from '../services/boardService'
import ProjectView from '../components/Project/ProjectView'

function Project() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBoard()
    }
  }, [id])

  const loadBoard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await boardService.getById(id!)
      setBoard(data)
    } catch (err) {
      console.error('Failed to load board:', err)
      setError('Projet non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadBoard()
  }

  const handleEditCard = (card: any) => {
    // Cette fonction sera passée au ProjectView
    // Le ProjectView gère déjà l'ouverture des modals de cartes
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Chargement du projet...</div>
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 text-lg font-semibold mb-2">
            {error || 'Projet non trouvé'}
          </div>
          <button
            onClick={() => navigate('/boards')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour aux projets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full max-h-full flex flex-col">
      <ProjectView 
        board={board} 
        onRefresh={handleRefresh} 
        onEditCard={handleEditCard} 
      />
    </div>
  )
}

export default Project
