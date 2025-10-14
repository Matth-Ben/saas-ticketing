import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Board, boardService } from '../../services/boardService'
import { useThemeStore } from '../../store/themeStore'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  useEffect(() => {
    loadBoards()
  }, [])

  // Garder le dropdown ouvert si on est sur une page de projet
  useEffect(() => {
    const isOnProjectPage = location.pathname.includes('/project/')
    setIsProjectsOpen(isOnProjectPage)
  }, [location.pathname])

  const loadBoards = async () => {
    try {
      setLoading(true)
      const data = await boardService.getAll()
      setBoards(data)
    } catch (error) {
      console.error('Failed to load boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (boardId: string) => {
    navigate(`/project/${boardId}`)
    onClose() // Fermer la sidebar sur mobile
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const isProjectActive = (boardId: string) => {
    return location.pathname.includes(`/project/${boardId}`)
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Kanban Tracker
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Changer le thème"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard */}
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={onClose}
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Projets Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isProjectsOpen
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📋</span>
                  <span className="font-medium">Projets</span>
                </div>
                <span className={`transform transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Liste des projets */}
              {isProjectsOpen && (
                <div className="ml-6 space-y-1">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Chargement...
                    </div>
                  ) : boards.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Aucun projet
                    </div>
                  ) : (
                    boards.map((board) => (
                      <button
                        key={board.id}
                        onClick={() => handleProjectClick(board.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isProjectActive(board.id)
                            ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: board.color || '#a8ff99' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{board.name}</div>
                          {board.clientName && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                              {board.clientName}
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                  
                  {/* Bouton créer un projet */}
                  <Link
                    to="/boards"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-sm">➕</span>
                    <span className="text-sm font-medium">Nouveau projet</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Rapports */}
            <Link
              to="/reports"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/reports')
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={onClose}
            >
              <span className="text-lg">📊</span>
              <span className="font-medium">Rapports</span>
            </Link>

            {/* Paramètres */}
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={onClose}
            >
              <span className="text-lg">⚙️</span>
              <span className="font-medium">Paramètres</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Kanban Time Tracker v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
