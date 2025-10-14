import { useThemeStore } from '../store/themeStore'

function Dashboard() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="h-full max-h-full overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tableau de bord</h1>
          <button
            onClick={toggleTheme}
            className="btn-secondary flex items-center gap-2"
            aria-label="Changer le thème"
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Projets actifs</h2>
          <p className="text-3xl font-bold text-secondary-600">0</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Tâches en cours</h2>
          <p className="text-3xl font-bold text-secondary-600">0</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Temps aujourd'hui</h2>
          <p className="text-3xl font-bold text-secondary-600">0h</p>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-2xl font-semibold mb-4">Bienvenue sur Kanban Time Tracker 🎯</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configuration initiale terminée. Le projet est prêt pour le développement des
          fonctionnalités.
        </p>
      </div>
      </div>
    </div>
  )
}

export default Dashboard

