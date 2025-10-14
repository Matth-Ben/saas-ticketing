import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Board, Card, cardService } from '../../services/boardService'
import SummaryView from './SummaryView'
import KanbanBoard from '../Kanban/KanbanBoard'
import ListView from './ListView'
import TimeTrackerView from '../TimeTracker/TimeTrackerView'
import QuoteView from '../Quote/QuoteView'

interface ProjectViewProps {
  board: Board
  onRefresh: () => void
  onEditCard: (card: Card) => void
}

type ViewType = 'summary' | 'kanban' | 'list' | 'timetracker' | 'quotes'

function ProjectView({ board, onRefresh, onEditCard }: ProjectViewProps) {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<ViewType>('kanban')
  const [allCards, setAllCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)

  // Charger toutes les cartes du board (pour les vues Résumé, Liste et TimeTracker)
  useEffect(() => {
    if (activeView === 'summary' || activeView === 'list' || activeView === 'timetracker') {
      loadAllCards()
    }
  }, [activeView, board.id])

  const loadAllCards = async () => {
    try {
      setLoading(true)
      const data = await cardService.getByBoard(board.id)
      setAllCards(data)
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'summary', label: '📊 Résumé', icon: '📊' },
    { id: 'kanban', label: '📋 Tableau', icon: '📋' },
    { id: 'list', label: '📝 Liste', icon: '📝' },
    { id: 'timetracker', label: '⏱️ Temps', icon: '⏱️' },
    { id: 'quotes', label: '💰 Devis', icon: '💰' },
  ]

  return (
    <div className="h-full max-h-full flex flex-col">
      {/* Barre d'onglets */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as ViewType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === tab.id
                    ? 'bg-secondary-300 text-primary-900'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
          <button
            onClick={() => navigate(`/project/${board.id}/settings`)}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Contenu de la vue active */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeView === 'summary' && (
          <div className="h-full overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
              </div>
            ) : (
              <SummaryView board={board} cards={allCards} />
            )}
          </div>
        )}

        {activeView === 'kanban' && (
          <div className="h-full p-6">
            <KanbanBoard board={board} onRefresh={onRefresh} />
          </div>
        )}

        {activeView === 'list' && (
          <div className="h-full overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
              </div>
            ) : (
              <ListView cards={allCards} onEditCard={onEditCard} />
            )}
          </div>
        )}

        {activeView === 'timetracker' && (
          <div className="h-full overflow-y-auto p-6">
            <TimeTrackerView board={board} onEditCard={onEditCard} />
          </div>
        )}

        {activeView === 'quotes' && (
          <div className="h-full overflow-y-auto p-6">
            <QuoteView board={board} onEditCard={onEditCard} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectView

