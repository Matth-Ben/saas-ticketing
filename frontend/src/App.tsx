import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import { useSidebarStore } from './hooks/useSidebar'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Boards from './pages/Boards'
import Project from './pages/Project'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ProjectSettings from './pages/ProjectSettings'
import CreateQuote from './pages/CreateQuote'

function App() {
  const { theme } = useThemeStore()
  const { isOpen: isSidebarOpen, close: closeSidebar, toggle: toggleSidebar } = useSidebarStore()

  return (
    <div className={theme}>
      <div className="h-screen max-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex overflow-hidden">
        <Router>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className={`flex-1 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : ''
          }`}>
            {/* Bouton hamburger pour mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-30">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
                title="Ouvrir le menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/boards" element={<Boards />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/project/:id/settings" element={<ProjectSettings />} />
              <Route path="/project/:boardId/quote/create" element={<CreateQuote />} />
            </Routes>
          </main>
        </Router>
      </div>
    </div>
  )
}

export default App

