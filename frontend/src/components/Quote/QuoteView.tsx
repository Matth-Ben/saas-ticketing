import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Board } from '../../services/boardService'
import { 
  Quote, 
  QuoteLine, 
  QuoteStatus, 
  QuoteLineType, 
  quoteService 
} from '../../services/quoteService'
import { companySettingsService, CompanySettings } from '../../services/companySettingsService'
import QuotePDFExport from './QuotePDFExport'

interface QuoteViewProps {
  board: Board
  onEditCard?: (card: any) => void
}

function QuoteView({ board, onEditCard }: QuoteViewProps) {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  useEffect(() => {
    loadQuotes()
  }, [board.id])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      const data = await quoteService.getByBoard(board.id)
      setQuotes(data)
    } catch (err) {
      console.error('Failed to load quotes:', err)
      setError('Erreur lors du chargement des devis')
    } finally {
      setLoading(false)
    }
  }


  const handleImportQuote = async (format: 'json' | 'csv', data: any) => {
    try {
      const newQuote = await quoteService.import(board.id, format, data)
      setQuotes([newQuote, ...quotes])
      setShowImportModal(false)
    } catch (err) {
      console.error('Failed to import quote:', err)
      setError('Erreur lors de l\'import du devis')
    }
  }

  const handleGenerateFromTasks = async (options: {
    hourlyRate: number
    margin: number
    includeCompleted?: boolean
  }) => {
    try {
      const newQuote = await quoteService.generateFromTasks(board.id, options)
      setQuotes([newQuote, ...quotes])
      setShowGenerateModal(false)
    } catch (err) {
      console.error('Failed to generate quote:', err)
      setError('Erreur lors de la génération du devis')
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) return

    try {
      await quoteService.delete(quoteId)
      setQuotes(quotes.filter(q => q.id !== quoteId))
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(null)
      }
    } catch (err) {
      console.error('Failed to delete quote:', err)
      setError('Erreur lors de la suppression du devis')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Chargement des devis...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Fermer
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Liste des devis */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📋 Devis ({quotes.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⚡ Auto
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📥 Import
            </button>
            <button
              onClick={() => navigate(`/project/${board.id}/quote/create`)}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              ➕ Nouveau
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedQuote?.id === quote.id
                  ? 'border-primary-300 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {quote.quoteNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {quote.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {quote.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${quoteService.getStatusColor(quote.status)}`}>
                    {quoteService.getStatusLabel(quote.status)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteQuote(quote.id)
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {quoteService.formatAmount(quote.totalAmount)}
                </span>
                <span className="text-gray-500 dark:text-gray-500">
                  {quoteService.formatHours(quote.totalHours)}
                </span>
              </div>
            </div>
          ))}

          {quotes.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-2">Aucun devis pour ce projet</p>
              <p className="text-sm">Créez votre premier devis</p>
            </div>
          )}
        </div>
      </div>

      {/* Détails du devis sélectionné */}
      <div className="flex-1 p-4">
        {selectedQuote ? (
          <QuoteDetails
            quote={selectedQuote}
            onUpdate={loadQuotes}
            onEditCard={onEditCard}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">📋</p>
              <p>Sélectionnez un devis pour voir les détails</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showImportModal && (
        <ImportQuoteModal
          onClose={() => setShowImportModal(false)}
          onSubmit={handleImportQuote}
        />
      )}

      {showGenerateModal && (
        <GenerateQuoteModal
          board={board}
          onClose={() => setShowGenerateModal(false)}
          onSubmit={handleGenerateFromTasks}
        />
      )}
    </div>
  )
}

// Composant pour les détails du devis
interface QuoteDetailsProps {
  quote: Quote
  onUpdate: () => void
  onEditCard?: (card: any) => void
}

function QuoteDetails({ quote, onUpdate, onEditCard }: QuoteDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [quoteData, setQuoteData] = useState<Partial<Quote>>(quote)
  const [showAddLineModal, setShowAddLineModal] = useState(false)

  const handleUpdateQuote = async () => {
    try {
      await quoteService.update(quote.id, quoteData)
      setEditing(false)
      onUpdate()
    } catch (err) {
      console.error('Failed to update quote:', err)
    }
  }

  const handleAddLine = async (lineData: Partial<QuoteLine>) => {
    try {
      await quoteService.addLine(quote.id, lineData)
      onUpdate()
      setShowAddLineModal(false)
    } catch (err) {
      console.error('Failed to add line:', err)
    }
  }

  const handleUpdateLine = async (lineId: string, lineData: Partial<QuoteLine>) => {
    try {
      await quoteService.updateLine(lineId, lineData)
      onUpdate()
    } catch (err) {
      console.error('Failed to update line:', err)
    }
  }

  const handleDeleteLine = async (lineId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) return

    try {
      await quoteService.deleteLine(lineId)
      onUpdate()
    } catch (err) {
      console.error('Failed to delete line:', err)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* En-tête du devis */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={quoteData.title || ''}
                onChange={(e) => setQuoteData({ ...quoteData, title: e.target.value })}
                className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {quote.title}
              </h1>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {quote.quoteNumber} • {quote.clientName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm rounded-full ${quoteService.getStatusColor(quote.status)}`}>
              {quoteService.getStatusLabel(quote.status)}
            </span>
            <QuotePDFExport quote={quote} />
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateQuote}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✓ Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setQuoteData(quote)
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  ✕ Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                ✏️ Modifier
              </button>
            )}
          </div>
        </div>

        {/* Informations du devis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Montant total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {quoteService.formatAmount(quote.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Heures totales</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {quoteService.formatHours(quote.totalHours)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Taux horaire</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {quoteService.formatAmount(quote.hourlyRate)}/h
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Marge</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {quote.margin}%
            </p>
          </div>
        </div>
      </div>

      {/* Lignes du devis */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lignes du devis ({quote.lines?.length || 0})
          </h3>
          <button
            onClick={() => setShowAddLineModal(true)}
            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            ➕ Ajouter une ligne
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  #
                </th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titre
                </th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Qté
                </th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prix unit.
                </th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total
                </th>
                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Heures
                </th>
                <th className="text-center py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.lines?.map((line) => (
                <QuoteLineRow
                  key={line.id}
                  line={line}
                  onUpdate={handleUpdateLine}
                  onDelete={handleDeleteLine}
                  onEditCard={onEditCard}
                />
              ))}
            </tbody>
          </table>

          {(!quote.lines || quote.lines.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Aucune ligne dans ce devis</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout de ligne */}
      {showAddLineModal && (
        <AddQuoteLineModal
          onClose={() => setShowAddLineModal(false)}
          onSubmit={handleAddLine}
        />
      )}
    </div>
  )
}

// Composant pour une ligne de devis
interface QuoteLineRowProps {
  line: QuoteLine
  onUpdate: (lineId: string, data: Partial<QuoteLine>) => void
  onDelete: (lineId: string) => void
  onEditCard?: (card: any) => void
}

function QuoteLineRow({ line, onUpdate, onDelete, onEditCard }: QuoteLineRowProps) {
  const [editing, setEditing] = useState(false)
  const [lineData, setLineData] = useState<Partial<QuoteLine>>(line)

  const handleSave = () => {
    onUpdate(line.id, lineData)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setLineData(line)
  }

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
        {line.lineNumber}
      </td>
      <td className="py-2 px-3">
        {editing ? (
          <input
            type="text"
            value={lineData.title || ''}
            onChange={(e) => setLineData({ ...lineData, title: e.target.value })}
            className="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
          />
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {line.title}
            </p>
            {line.card && (
              <button
                onClick={() => onEditCard?.(line.card)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                {line.card.key} - {line.card.title}
              </button>
            )}
          </div>
        )}
      </td>
      <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
        {quoteService.getLineTypeLabel(line.type)}
      </td>
      <td className="py-2 px-3 text-right">
        {editing ? (
          <input
            type="number"
            value={lineData.quantity || ''}
            onChange={(e) => setLineData({ ...lineData, quantity: parseFloat(e.target.value) || 0 })}
            className="w-16 text-sm text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            min="0"
            step="0.01"
          />
        ) : (
          <span className="text-sm text-gray-900 dark:text-white">
            {line.quantity}
          </span>
        )}
      </td>
      <td className="py-2 px-3 text-right">
        {editing ? (
          <input
            type="number"
            value={lineData.unitPrice || ''}
            onChange={(e) => setLineData({ ...lineData, unitPrice: parseFloat(e.target.value) || 0 })}
            className="w-20 text-sm text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            min="0"
            step="0.01"
          />
        ) : (
          <span className="text-sm text-gray-900 dark:text-white">
            {quoteService.formatAmount(line.unitPrice)}
          </span>
        )}
      </td>
      <td className="py-2 px-3 text-right">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {quoteService.formatAmount(line.totalPrice)}
        </span>
      </td>
      <td className="py-2 px-3 text-right">
        {editing ? (
          <input
            type="number"
            value={lineData.estimatedHours || ''}
            onChange={(e) => setLineData({ ...lineData, estimatedHours: parseFloat(e.target.value) || 0 })}
            className="w-16 text-sm text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none"
            min="0"
            step="0.1"
          />
        ) : (
          <span className="text-sm text-gray-900 dark:text-white">
            {line.estimatedHours ? quoteService.formatHours(line.estimatedHours) : '-'}
          </span>
        )}
      </td>
      <td className="py-2 px-3 text-center">
        {editing ? (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(line.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              🗑️
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}



// Modal d'import de devis
interface ImportQuoteModalProps {
  onClose: () => void
  onSubmit: (format: 'json' | 'csv', data: any) => void
}

function ImportQuoteModal({ onClose, onSubmit }: ImportQuoteModalProps) {
  const [format, setFormat] = useState<'json' | 'csv'>('json')
  const [data, setData] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let parsedData
      if (format === 'json') {
        parsedData = JSON.parse(data)
      } else {
        parsedData = data
      }
      onSubmit(format, parsedData)
    } catch (err) {
      alert('Erreur dans le format des données')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Importer un devis</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Données
            </label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder={format === 'json' 
                ? '[\n  {\n    "title": "Tâche 1",\n    "quantity": 1,\n    "price": 100,\n    "hours": 2\n  }\n]'
                : 'title,quantity,price,hours\nTâche 1,1,100,2\nTâche 2,1,150,3'
              }
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Importer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal de génération automatique
interface GenerateQuoteModalProps {
  board: Board
  onClose: () => void
  onSubmit: (options: { hourlyRate: number; margin: number; includeCompleted?: boolean; selectedCardIds?: string[]; title?: string; clientName?: string }) => void
}

function GenerateQuoteModal({ board, onClose, onSubmit }: GenerateQuoteModalProps) {
  const [hourlyRate, setHourlyRate] = useState(50)
  const [margin, setMargin] = useState(20)
  const [includeCompleted, setIncludeCompleted] = useState(false)
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [availableTasks, setAvailableTasks] = useState<any[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null)

  useEffect(() => {
    loadCompanySettings()
    loadAvailableTasks()
  }, [includeCompleted])

  const loadCompanySettings = async () => {
    try {
      const settings = await companySettingsService.get()
      setCompanySettings(settings)
      setHourlyRate(settings.defaultHourlyRate)
      setMargin(settings.defaultMargin)
    } catch (error) {
      console.error('Failed to load company settings:', error)
    }
  }

  // Utiliser le nom du projet comme client par défaut
  useEffect(() => {
    if (board.name && !clientName) {
      setClientName(board.name)
    }
  }, [board.name, clientName])

  const loadAvailableTasks = async () => {
    try {
      setLoading(true)
      const tasks = await quoteService.getAvailableTasks(board.id, includeCompleted)
      setAvailableTasks(tasks)
      // Sélectionner toutes les tâches par défaut
      setSelectedTasks(tasks.map((task: any) => task.id))
    } catch (error) {
      console.error('Failed to load available tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAll = () => {
    setSelectedTasks(availableTasks.map((task: any) => task.id))
  }

  const handleSelectNone = () => {
    setSelectedTasks([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ 
      hourlyRate, 
      margin, 
      includeCompleted, 
      selectedCardIds: selectedTasks,
      title: title || undefined,
      clientName: clientName || undefined
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Générer un devis automatiquement</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations du devis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du devis (optionnel)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Site e-commerce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du client (optionnel)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Client ABC"
              />
              {board.clientName && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Client associé au projet: {board.clientName}
                </p>
              )}
            </div>
          </div>

          {/* Paramètres financiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Taux horaire (€)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Marge (%)
              </label>
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCompleted}
                onChange={(e) => setIncludeCompleted(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Inclure les tâches terminées
              </span>
            </label>
          </div>

          {/* Sélection des tâches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sélectionner les tâches ({selectedTasks.length}/{availableTasks.length})
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Tout sélectionner
                </button>
                <button
                  type="button"
                  onClick={handleSelectNone}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Tout désélectionner
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Chargement des tâches...
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                {availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleTaskToggle(task.id)}
                      className="mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {task.key}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.status === 'Done' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {task.status}
                        </span>
                        {task.estimatedTime && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {quoteService.formatHours(task.estimatedTime)}
                          </span>
                        )}
                        {task.category && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={selectedTasks.length === 0}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Générer ({selectedTasks.length} tâche{selectedTasks.length > 1 ? 's' : ''})
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal d'ajout de ligne
interface AddQuoteLineModalProps {
  onClose: () => void
  onSubmit: (data: Partial<QuoteLine>) => void
}

function AddQuoteLineModal({ onClose, onSubmit }: AddQuoteLineModalProps) {
  const [formData, setFormData] = useState<Partial<QuoteLine>>({
    type: QuoteLineType.TASK,
    title: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    estimatedHours: 0,
    category: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Ajouter une ligne</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as QuoteLineType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.values(QuoteLineType).map((type) => (
                <option key={type} value={type}>
                  {quoteService.getLineTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix unitaire (€)
              </label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Heures estimées
            </label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteView
