import { useState } from 'react'
import { Card } from '../../services/boardService'

interface ListViewProps {
  cards: Card[]
  onEditCard: (card: Card) => void
}

function ListView({ cards, onEditCard }: ListViewProps) {
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedCards = [...cards].sort((a, b) => {
    let aValue: any = a[sortField as keyof Card]
    let bValue: any = b[sortField as keyof Card]

    // Gestion des valeurs nulles/undefined
    if (!aValue) return sortOrder === 'asc' ? 1 : -1
    if (!bValue) return sortOrder === 'asc' ? -1 : 1

    // Tri selon le type
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const SortIcon = ({ field }: { field: string }) => (
    <span className="ml-1 text-xs">
      {sortField === field ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  const priorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('category')}
            >
              Type <SortIcon field="category" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('key')}
            >
              Clé <SortIcon field="key" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('title')}
            >
              Résumé <SortIcon field="title" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('status')}
            >
              État <SortIcon field="status" />
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
              💬
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('category')}
            >
              Catégorie <SortIcon field="category" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('assignee')}
            >
              Assigné <SortIcon field="assignee" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('dueDate')}
            >
              Échéance <SortIcon field="dueDate" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('priority')}
            >
              Priorité <SortIcon field="priority" />
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Étiquettes
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('createdAt')}
            >
              Création <SortIcon field="createdAt" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('updatedAt')}
            >
              M.à.j <SortIcon field="updatedAt" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSort('reporter')}
            >
              Rapporteur <SortIcon field="reporter" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedCards.map((card) => (
            <tr
              key={card.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => onEditCard(card)}
            >
              {/* Type */}
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {card.category || '-'}
              </td>

              {/* Clé */}
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">
                  {card.key}
                </span>
              </td>

              {/* Résumé */}
              <td className="px-4 py-3 max-w-md">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {card.title}
                </div>
              </td>

              {/* État */}
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  {card.status}
                </span>
              </td>

              {/* Commentaires */}
              <td className="px-4 py-3 text-center">
                {card.comments && card.comments.length > 0 && (
                  <span className="text-gray-600 dark:text-gray-400">{card.comments.length}</span>
                )}
              </td>

              {/* Catégorie */}
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {card.category || '-'}
              </td>

              {/* Personne assignée */}
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {card.assignee || '-'}
              </td>

              {/* Date d'échéance */}
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {card.dueDate 
                  ? new Date(card.dueDate).toLocaleDateString('fr-FR')
                  : '-'
                }
              </td>

              {/* Priorité */}
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${priorityBadge(card.priority)}`}>
                  {card.priority === 'high' ? 'Haute' : card.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </td>

              {/* Étiquettes */}
              <td className="px-4 py-3">
                {card.labels && card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {card.labels.slice(0, 2).map((label, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {label}
                      </span>
                    ))}
                    {card.labels.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{card.labels.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </td>

              {/* Création */}
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                {new Date(card.createdAt).toLocaleDateString('fr-FR')}
              </td>

              {/* Mise à jour */}
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                {new Date(card.updatedAt).toLocaleDateString('fr-FR')}
              </td>

              {/* Rapporteur */}
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {card.reporter || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cards.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucune tâche dans ce projet
        </div>
      )}
    </div>
  )
}

export default ListView

