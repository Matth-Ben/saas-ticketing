import React, { useState } from 'react'
import { TimelineSettings as TimelineSettingsType } from '../../services/timelineService'

interface TimelineSettingsProps {
  settings: TimelineSettingsType
  onSettingsChange: (settings: TimelineSettingsType) => void
  onClose: () => void
}

const TimelineSettings: React.FC<TimelineSettingsProps> = ({ 
  settings, 
  onSettingsChange, 
  onClose 
}) => {
  const [localSettings, setLocalSettings] = useState<TimelineSettingsType>(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleWorkingDayChange = (day: number, checked: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      workingDays: checked 
        ? [...prev.workingDays, day]
        : prev.workingDays.filter(d => d !== day)
    }))
  }

  const dayNames = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ⚙️ Paramètres de la Timeline
        </h2>
        
        <div className="space-y-6">
          {/* Heures de travail par jour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heures de travail par jour
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={localSettings.workHoursPerDay}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                workHoursPerDay: parseInt(e.target.value) || 8
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Jours de travail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jours de travail
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dayNames.map((dayName, dayIndex) => (
                <label key={dayIndex} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings.workingDays.includes(dayIndex)}
                    onChange={(e) => handleWorkingDayChange(dayIndex, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {dayName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Heure de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heure de début
            </label>
            <input
              type="time"
              value={localSettings.startTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                startTime: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Heure de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heure de fin
            </label>
            <input
              type="time"
              value={localSettings.endTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                endTime: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sauvegarder
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimelineSettings
