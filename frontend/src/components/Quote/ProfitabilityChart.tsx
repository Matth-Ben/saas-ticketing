import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Board } from '../../services/boardService'
import { ProfitabilityStats, quoteService } from '../../services/quoteService'

interface ProfitabilityChartProps {
  board: Board
}

function ProfitabilityChart({ board }: ProfitabilityChartProps) {
  const [stats, setStats] = useState<ProfitabilityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfitabilityStats()
  }, [board.id])

  const loadProfitabilityStats = async () => {
    try {
      setLoading(true)
      const data = await quoteService.getProfitabilityStats(board.id)
      setStats(data)
    } catch (err) {
      console.error('Failed to load profitability stats:', err)
      setError('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Chargement des statistiques...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadProfitabilityStats}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!stats || stats.quotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="mb-2">📊</p>
        <p>Aucune donnée de rentabilité disponible</p>
        <p className="text-sm">Créez des devis pour voir les statistiques</p>
      </div>
    )
  }

  // Préparer les données pour les graphiques
  const barChartData = stats.quotes.map((quote) => ({
    name: quote.quoteNumber,
    estimated: quote.estimatedAmount,
    actual: quote.actualAmount,
    profitability: quote.profitability,
    status: quote.status || 'draft',
  }))

  const pieChartData = [
    {
      name: 'Rentable',
      value: stats.quotes.filter(q => q.profitability > 0).length,
      color: '#10B981', // green-500
    },
    {
      name: 'Équilibré',
      value: stats.quotes.filter(q => q.profitability === 0).length,
      color: '#F59E0B', // yellow-500
    },
    {
      name: 'Déficitaire',
      value: stats.quotes.filter(q => q.profitability < 0).length,
      color: '#EF4444', // red-500
    },
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estimé: {quoteService.formatAmount(data.estimated)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Réel: {quoteService.formatAmount(data.actual)}
          </p>
          <p className={`text-sm font-medium ${quoteService.getProfitabilityColor(data.profitability)}`}>
            Rentabilité: {data.profitability.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant estimé</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {quoteService.formatAmount(stats.summary.totalEstimatedAmount)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant réel</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {quoteService.formatAmount(stats.summary.totalActualAmount)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rentabilité globale</p>
          <p className={`text-2xl font-bold ${quoteService.getProfitabilityColor(stats.summary.overallProfitability)}`}>
            {stats.summary.overallProfitability.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre de devis</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.summary.totalQuotes}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique à barres - Comparaison estimé vs réel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comparaison Estimé vs Réel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="estimated" 
                fill="#3B82F6" 
                name="Estimé"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                fill="#10B981" 
                name="Réel"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique circulaire - Répartition de la rentabilité */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition de la Rentabilité
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* État des devis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            État des Devis
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.quotes.map((quote) => (
              <div
                key={quote.quoteId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {quote.quoteNumber}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {quote.title}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${quoteService.getStatusColor(quote.status || 'draft')}`}>
                    {quoteService.getStatusLabel(quote.status || 'draft')}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Estimé:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quoteService.formatAmount(quote.estimatedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Réel:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quoteService.formatAmount(quote.actualAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rentabilité:</span>
                    <span className={`font-medium ${quoteService.getProfitabilityColor(quote.profitability)}`}>
                      {quote.profitability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Heures:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quoteService.formatHours(quote.estimatedHours)} / {quoteService.formatHours(quote.actualHours)}
                    </span>
                  </div>
                </div>

                {/* Barre de progression de la rentabilité */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Progression</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {quote.estimatedHours > 0 ? Math.round((quote.actualHours / quote.estimatedHours) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        quote.profitability > 0
                          ? 'bg-green-500'
                          : quote.profitability === 0
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((quote.actualHours / (quote.estimatedHours || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Détail par Devis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Devis
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimé
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Réel
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Heures Estimées
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Heures Réelles
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rentabilité
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marge
                </th>
                <th className="text-center py-3 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.quotes.map((quote) => (
                <tr key={quote.quoteId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="py-3 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {quote.quoteNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {quote.title}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {quoteService.formatAmount(quote.estimatedAmount)}
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {quoteService.formatAmount(quote.actualAmount)}
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {quoteService.formatHours(quote.estimatedHours)}
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {quoteService.formatHours(quote.actualHours)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <span className={`text-sm font-medium ${quoteService.getProfitabilityColor(quote.profitability)}`}>
                      {quote.profitability.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {quote.margin}%
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${quoteService.getStatusColor(quote.status || 'draft')}`}>
                      {quoteService.getStatusLabel(quote.status || 'draft')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400">📈</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Devis rentables
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.quotes.filter(q => q.profitability > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400">⚖️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Devis équilibrés
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.quotes.filter(q => q.profitability === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400">📉</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Devis déficitaires
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.quotes.filter(q => q.profitability < 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfitabilityChart
