import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Board, boardService } from '../services/boardService'

function ProjectSettings() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBoard()
    }
  }, [id])

  const loadBoard = async () => {
    try {
      setLoading(true)
      const data = await boardService.getById(id!)
      setBoard(data)
    } catch (err) {
      console.error('Failed to load board:', err)
      setError('Erreur lors du chargement du projet')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!board || !id) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      await boardService.update(id, board)
      setSuccess('Paramètres du projet sauvegardés avec succès !')
    } catch (err) {
      console.error('Failed to save board settings:', err)
      setError('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Board, value: any) => {
    if (!board) return
    setBoard({ ...board, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Chargement du projet...</div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Projet non trouvé</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚙️ Paramètres du projet
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Configurez les informations du projet et du client associé
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Informations du projet */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📋 Informations du projet
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du projet *
              </label>
              <input
                type="text"
                value={board.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={board.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Description du projet..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couleur du projet
              </label>
              <input
                type="color"
                value={board.color || '#a8ff99'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Informations du client */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            👤 Informations du client
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Ces informations seront automatiquement utilisées lors de la génération de devis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du client
              </label>
              <input
                type="text"
                value={board.clientName || ''}
                onChange={(e) => handleChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nom du client"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email du client
              </label>
              <input
                type="email"
                value={board.clientEmail || ''}
                onChange={(e) => handleChange('clientEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone du client
              </label>
              <input
                type="tel"
                value={board.clientPhone || ''}
                onChange={(e) => handleChange('clientPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse du client
              </label>
              <textarea
                value={board.clientAddress || ''}
                onChange={(e) => handleChange('clientAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Adresse complète du client..."
              />
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            👁️ Aperçu
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: board.color || '#a8ff99' }}
              />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {board.name}
              </h3>
            </div>

            {board.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {board.description}
              </p>
            )}

            {board.clientName && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Client associé
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-900 dark:text-white">
                    <strong>{board.clientName}</strong>
                  </p>
                  {board.clientEmail && (
                    <p className="text-gray-600 dark:text-gray-400">
                      📧 {board.clientEmail}
                    </p>
                  )}
                  {board.clientPhone && (
                    <p className="text-gray-600 dark:text-gray-400">
                      📞 {board.clientPhone}
                    </p>
                  )}
                  {board.clientAddress && (
                    <p className="text-gray-600 dark:text-gray-400">
                      📍 {board.clientAddress}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectSettings
