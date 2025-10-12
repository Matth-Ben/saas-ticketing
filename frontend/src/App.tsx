import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import Navbar from './components/Layout/Navbar'
import Dashboard from './pages/Dashboard'
import Boards from './pages/Boards'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  const { theme } = useThemeStore()

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/boards" element={<Boards />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App

