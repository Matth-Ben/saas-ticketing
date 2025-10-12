import { useThemeStore } from '../store/themeStore'

function Settings() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Paramètres</h1>
      
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Apparence</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Thème</label>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                ☀️ Clair
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                🌙 Sombre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

