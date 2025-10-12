import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'

function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/boards', label: '📁 Projets' },
    { path: '/reports', label: '📊 Rapports' },
    { path: '/settings', label: '⚙️ Paramètres' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo et navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-primary-500 dark:text-secondary-300">
            Kanban Time Tracker
          </Link>

          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive(item.path)
                    ? 'bg-secondary-300 text-primary-900'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bouton thème */}
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Changer le thème"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden flex gap-1 mt-3 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors font-medium ${
              isActive(item.path)
                ? 'bg-secondary-300 text-primary-900'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar

