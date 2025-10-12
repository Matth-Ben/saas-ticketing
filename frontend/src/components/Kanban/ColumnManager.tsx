import { useState } from 'react'
import { Board, boardService } from '../../services/boardService'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import ColorPicker from './ColorPicker'

interface ColumnManagerProps {
  board: Board
  onUpdate: (updatedBoard: Board) => void
  onClose: () => void
}

function ColumnManager({ board, onUpdate, onClose }: ColumnManagerProps) {
  const [columns, setColumns] = useState<string[]>([...board.columns])
  const [columnColors, setColumnColors] = useState<{ [key: string]: string }>(board.columnColors || {})
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnColor, setNewColumnColor] = useState('#93c5fd')
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Ajouter une colonne
  const handleAddColumn = async () => {
    if (!newColumnName.trim()) {
      setError('Le nom de la colonne est requis')
      return
    }

    if (columns.includes(newColumnName.trim())) {
      setError('Cette colonne existe déjà')
      return
    }

    try {
      setLoading(true)
      setError('')
      const updatedBoard = await boardService.addColumn(board.id, newColumnName.trim(), newColumnColor)
      setColumns(updatedBoard.columns)
      setColumnColors(updatedBoard.columnColors)
      setNewColumnName('')
      setNewColumnColor('#93c5fd')
      onUpdate(updatedBoard)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la colonne')
    } finally {
      setLoading(false)
    }
  }

  // Commencer à renommer
  const startEditing = (columnName: string) => {
    setEditingColumn(columnName)
    setEditName(columnName)
    setError('')
  }

  // Renommer une colonne
  const handleRenameColumn = async (oldName: string) => {
    if (!editName.trim() || editName.trim() === oldName) {
      setEditingColumn(null)
      return
    }

    if (columns.includes(editName.trim()) && editName.trim() !== oldName) {
      setError('Une colonne avec ce nom existe déjà')
      return
    }

    try {
      setLoading(true)
      setError('')
      const updatedBoard = await boardService.renameColumn(board.id, oldName, editName.trim())
      setColumns(updatedBoard.columns)
      setEditingColumn(null)
      onUpdate(updatedBoard)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du renommage')
    } finally {
      setLoading(false)
    }
  }

  // Supprimer une colonne
  const handleDeleteColumn = async (columnName: string) => {
    if (columns.length <= 1) {
      setError('Impossible de supprimer la dernière colonne')
      return
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la colonne "${columnName}" ?`)) {
      return
    }

    try {
      setLoading(true)
      setError('')
      const updatedBoard = await boardService.deleteColumn(board.id, columnName)
      setColumns(updatedBoard.columns)
      onUpdate(updatedBoard)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour la couleur d'une colonne
  const handleColorChange = async (columnName: string, color: string) => {
    try {
      setColumnColors({ ...columnColors, [columnName]: color })
      const updatedBoard = await boardService.updateColumnColor(board.id, columnName, color)
      onUpdate(updatedBoard)
    } catch (err: any) {
      setError('Erreur lors de la mise à jour de la couleur')
      setColumnColors(board.columnColors) // Restaurer
    }
  }

  // Réorganiser les colonnes
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setColumns(items)

    try {
      const updatedBoard = await boardService.reorderColumns(board.id, items)
      onUpdate(updatedBoard)
    } catch (err: any) {
      setError('Erreur lors de la réorganisation')
      setColumns([...board.columns]) // Restaurer l'ordre original
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gérer les colonnes
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Erreur */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Ajouter une colonne */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Ajouter une colonne
            </h3>
            <div className="flex gap-2 items-start">
              <ColorPicker
                currentColor={newColumnColor}
                onColorChange={setNewColumnColor}
              />
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
                placeholder="Nom de la nouvelle colonne"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              />
              <button
                onClick={handleAddColumn}
                disabled={loading || !newColumnName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Liste des colonnes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Colonnes actuelles ({columns.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              💡 Glissez-déposez pour réorganiser • Double-cliquez pour renommer
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="columns">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {columns.map((column, index) => (
                      <Draggable key={column} draggableId={column} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-l-4 ${
                              snapshot.isDragging
                                ? 'border-secondary-300 shadow-lg'
                                : 'border-transparent'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              borderLeftColor: columnColors[column] || '#93c5fd',
                            }}
                          >
                            {/* Icône de drag */}
                            <span className="text-gray-400 cursor-grab">⋮⋮</span>

                            {/* Sélecteur de couleur */}
                            <ColorPicker
                              currentColor={columnColors[column] || '#93c5fd'}
                              onColorChange={(color) => handleColorChange(column, color)}
                            />

                            {/* Nom de la colonne */}
                            {editingColumn === column ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={() => handleRenameColumn(column)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleRenameColumn(column)
                                  if (e.key === 'Escape') setEditingColumn(null)
                                }}
                                autoFocus
                                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                disabled={loading}
                              />
                            ) : (
                              <span
                                onDoubleClick={() => startEditing(column)}
                                className="flex-1 text-gray-900 dark:text-white font-medium cursor-pointer"
                              >
                                {column}
                              </span>
                            )}

                            {/* Actions */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditing(column)}
                                className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400"
                                title="Renommer"
                                disabled={loading}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteColumn(column)}
                                className="px-2 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                title="Supprimer"
                                disabled={loading || columns.length <= 1}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm">
            <strong>⚠️ Important :</strong> Vous ne pouvez pas supprimer une colonne qui contient
            des cartes. Déplacez d'abord les cartes vers une autre colonne.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColumnManager

