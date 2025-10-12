import { useState, useEffect } from 'react'
import { timeService, TimeEntry } from '../../services/timeService'

interface DetailsPanelProps {
  cardId?: string // ID de la carte pour charger les timeEntries
  formData: {
    status: string
    priority: string
    assignee: string
    reporter: string
    category: string
    labels: string[]
    estimatedTime: string
    actualTime: string
    startDate: string
    dueDate: string
  }
  boardColumns: string[]
  onChange: (field: string, value: any) => void
}

function DetailsPanel({ cardId, formData, boardColumns, onChange }: DetailsPanelProps) {
  const [newLabel, setNewLabel] = useState('')
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [totalTimeMinutes, setTotalTimeMinutes] = useState<number>(0)

  // Charger les timeEntries si cardId est fourni
  useEffect(() => {
    if (cardId) {
      loadTimeEntries()
    }
  }, [cardId])

  const loadTimeEntries = async () => {
    if (!cardId) return
    try {
      const entries = await timeService.getByCard(cardId)
      setTimeEntries(entries)
      
      // Calculer le temps total
      const total = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
      setTotalTimeMinutes(total)
    } catch (err) {
      console.error('Failed to load time entries:', err)
    }
  }

  const handleAddLabel = () => {
    if (!newLabel.trim()) return
    const updatedLabels = [...(formData.labels || []), newLabel.trim()]
    onChange('labels', updatedLabels)
    setNewLabel('')
  }

  const handleRemoveLabel = (index: number) => {
    const updatedLabels = formData.labels.filter((_, i) => i !== index)
    onChange('labels', updatedLabels)
  }

  const categories = [
    'Développement',
    'Design',
    'Bug',
    'Feature',
    'Documentation',
    'Testing',
    'DevOps',
    'Autre',
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Détails</h3>

      {/* Statut */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Statut
        </label>
        <select
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {boardColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Priorité */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Priorité
        </label>
        <select
          value={formData.priority}
          onChange={(e) => onChange('priority', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="low">🔵 Basse</option>
          <option value="medium">🟡 Moyenne</option>
          <option value="high">🔴 Haute</option>
        </select>
      </div>

      {/* Assigné à */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          👤 Assigné à
        </label>
        <input
          type="text"
          value={formData.assignee}
          onChange={(e) => onChange('assignee', e.target.value)}
          placeholder="Nom de la personne"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Rapporteur */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          📢 Rapporteur
        </label>
        <input
          type="text"
          value={formData.reporter}
          onChange={(e) => onChange('reporter', e.target.value)}
          placeholder="Qui a créé cette tâche"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          📂 Catégorie
        </label>
        <select
          value={formData.category}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Sélectionner...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Étiquettes */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          🏷️ Étiquettes
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
            placeholder="Ajouter une étiquette"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {newLabel.trim() && (
            <button
              onClick={handleAddLabel}
              className="px-3 py-1.5 text-xs bg-secondary-300 text-primary-900 font-semibold rounded hover:bg-secondary-400"
            >
              +
            </button>
          )}
        </div>
        {formData.labels && formData.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {formData.labels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
              >
                {label}
                <button
                  onClick={() => handleRemoveLabel(index)}
                  className="hover:text-red-600 dark:hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            📅 Date de début
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            ⏰ Date d'échéance
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => onChange('dueDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Suivi temporel */}
      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">⏱️ Suivi temporel</h4>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Temps estimé (heures)
          </label>
          <input
            type="number"
            value={formData.estimatedTime}
            onChange={(e) => onChange('estimatedTime', e.target.value)}
            min="0"
            step="0.5"
            placeholder="Ex: 5"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Temps réel (heures)
          </label>
          <div className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {totalTimeMinutes > 0 
                  ? `${(totalTimeMinutes / 60).toFixed(1)}h` 
                  : (formData.actualTime ? `${formData.actualTime}h` : '0h')
                }
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timeService.formatDuration(totalTimeMinutes)}
              </span>
            </div>
          </div>
          {timeEntries.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              📊 {timeEntries.length} session{timeEntries.length > 1 ? 's' : ''} enregistrée{timeEntries.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Indicateur de temps */}
        {formData.estimatedTime && totalTimeMinutes > 0 && (
          <div className={`p-2 rounded text-xs ${
            (totalTimeMinutes / 60) > parseFloat(formData.estimatedTime)
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-green-50 dark:bg-green-900/20'
          }`}>
            <p className={
              (totalTimeMinutes / 60) > parseFloat(formData.estimatedTime)
                ? 'text-red-800 dark:text-red-300'
                : 'text-green-800 dark:text-green-300'
            }>
              {(totalTimeMinutes / 60) > parseFloat(formData.estimatedTime) ? (
                <>⚠️ Dépassement de {((totalTimeMinutes / 60) - parseFloat(formData.estimatedTime)).toFixed(1)}h</>
              ) : (
                <>✅ Dans les temps ({(parseFloat(formData.estimatedTime) - (totalTimeMinutes / 60)).toFixed(1)}h restantes)</>
              )}
            </p>
          </div>
        )}

        {/* Liste des sessions de temps */}
        {timeEntries.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Sessions enregistrées ({timeEntries.length})
            </h5>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {timeService.formatDuration(entry.duration || 0)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                      {new Date(entry.startTime).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      {' à '}
                      {new Date(entry.startTime).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {entry.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-[10px] ml-2 truncate max-w-[100px]">
                      {entry.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailsPanel

