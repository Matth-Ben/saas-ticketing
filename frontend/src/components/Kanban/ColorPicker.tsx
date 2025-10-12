import { useState } from 'react'

interface ColorPickerProps {
  currentColor: string
  onColorChange: (color: string) => void
}

const PRESET_COLORS = [
  '#93c5fd', // Bleu clair
  '#fbbf24', // Jaune/Orange
  '#a8ff99', // Vert (notre secondaire)
  '#f472b6', // Rose
  '#a78bfa', // Violet
  '#34d399', // Vert émeraude
  '#fb923c', // Orange
  '#38bdf8', // Cyan
  '#f87171', // Rouge
  '#60a5fa', // Bleu
  '#c084fc', // Pourpre
  '#4ade80', // Vert lime
]

function ColorPicker({ currentColor, onColorChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [customColor, setCustomColor] = useState(currentColor)

  const handlePresetClick = (color: string) => {
    onColorChange(color)
    setShowPicker(false)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    onColorChange(color)
  }

  return (
    <div className="relative">
      {/* Bouton de sélection de couleur */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm"
        style={{ backgroundColor: currentColor }}
        title="Changer la couleur"
      />

      {/* Menu de sélection */}
      {showPicker && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />

          {/* Picker */}
          <div className="absolute top-12 right-0 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-64">
            <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Couleurs prédéfinies
            </h4>
            
            {/* Grille de couleurs */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    currentColor === color
                      ? 'border-primary-500 ring-2 ring-primary-300'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Sélecteur de couleur personnalisé */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Couleur personnalisée
              </h4>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      onColorChange(e.target.value)
                    }
                  }}
                  placeholder="#RRGGBB"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColorPicker

