import { Droppable } from '@hello-pangea/dnd'
import { Card } from '../../services/boardService'
import CardItem from './CardItem'

interface ColumnProps {
  title: string
  color?: string
  cards: Card[]
  boardColumns: string[]
  onEdit: (card: Card) => void
  onDelete: (cardId: string) => void
  onAddCard: (status: string) => void
  onUpdate: () => void
  onEditSubtask: (subtask: Card) => void
}

function Column({ title, color = '#93c5fd', cards, boardColumns, onEdit, onDelete, onAddCard, onUpdate, onEditSubtask }: ColumnProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-w-[300px] max-w-[350px] flex flex-col border-t-4" style={{ borderTopColor: color }}>
      {/* En-tête de la colonne */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{title}</span>
          <span className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </h2>
        <button
          onClick={() => onAddCard(title)}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          title="Ajouter une carte"
        >
          ➕
        </button>
      </div>

      {/* Zone de drop */}
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/20 rounded-lg' : ''
            }`}
          >
              {cards.map((card, index) => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  index={index} 
                  statusColor={color}
                  boardColumns={boardColumns}
                  onEdit={onEdit} 
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onEditSubtask={onEditSubtask}
                />
              ))}
            {provided.placeholder}

            {/* Message si colonne vide */}
            {cards.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-600 py-8">
                Aucune carte
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default Column

