import { useState, useEffect } from 'react';
import { Board, Card, cardService } from '../../services/boardService';
import { timeService, TimeEntry } from '../../services/timeService';
import TimeEntryModal from './TimeEntryModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeTrackerViewProps {
  board: Board;
  onEditCard?: (card: Card) => void;
}

interface TimeEntryWithCard extends TimeEntry {
  card?: Card;
}

function TimeTrackerView({ board, onEditCard }: TimeTrackerViewProps) {
  const [entries, setEntries] = useState<TimeEntryWithCard[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntryWithCard | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCard, setFilterCard] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [board.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les cartes du board
      const cardsData = await cardService.getByBoard(board.id);
      setCards(cardsData);

      // Charger toutes les TimeEntries
      const allEntries: TimeEntryWithCard[] = [];
      
      for (const card of cardsData) {
        try {
          const cardEntries = await timeService.getByCard(card.id);
          const entriesWithCard = cardEntries.map((entry) => ({
            ...entry,
            card,
          }));
          allEntries.push(...entriesWithCard);
        } catch (err) {
          console.error(`Failed to load time entries for card ${card.id}:`, err);
        }
      }

      // Trier par date décroissante
      allEntries.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setEntries(allEntries);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setSelectedEntry(null);
    loadData();
  };

  const handleDelete = () => {
    loadData();
  };

  // Filtrage des entrées
  const filteredEntries = entries.filter((entry) => {
    if (filterDate) {
      const entryDate = format(new Date(entry.startTime), 'yyyy-MM-dd');
      if (entryDate !== filterDate) return false;
    }

    if (filterCard && entry.cardId !== filterCard) return false;

    return true;
  });

  // Calcul des totaux
  const totalDuration = filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalSessions = filteredEntries.length;

  // Grouper par jour
  const groupedByDay = filteredEntries.reduce((acc, entry) => {
    const day = format(new Date(entry.startTime), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<string, TimeEntryWithCard[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Chargement des entrées de temps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⏱️ Suivi du temps</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalSessions} session{totalSessions > 1 ? 's' : ''} · {timeService.formatDuration(totalDuration)}
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-3">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Filtrer par date"
          />

          <select
            value={filterCard}
            onChange={(e) => setFilterCard(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Toutes les cartes</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.key} - {card.title}
              </option>
            ))}
          </select>

          {(filterDate || filterCard) && (
            <button
              onClick={() => {
                setFilterDate('');
                setFilterCard('');
              }}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ✕ Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste des entrées groupées par jour */}
      {Object.keys(groupedByDay).length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Aucune entrée de temps enregistrée
            {(filterDate || filterCard) && ' pour ces filtres'}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDay).map(([day, dayEntries]) => {
            const dayTotal = dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
            const dayDate = new Date(day);

            return (
              <div key={day} className="card">
                {/* En-tête du jour */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(dayDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </h2>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {timeService.formatDuration(dayTotal)} ({dayEntries.length} session{dayEntries.length > 1 ? 's' : ''})
                  </span>
                </div>

                {/* Tableau des entrées */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <tr>
                        <th className="text-left py-2 px-3">Carte</th>
                        <th className="text-left py-2 px-3">Description</th>
                        <th className="text-left py-2 px-3">Début</th>
                        <th className="text-left py-2 px-3">Fin</th>
                        <th className="text-right py-2 px-3">Durée</th>
                        <th className="text-right py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEntries.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          {/* Carte */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {entry.card && (
                                <>
                                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    {entry.card.key}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEditCard && entry.card) onEditCard(entry.card);
                                    }}
                                    className="text-sm text-gray-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-400 truncate max-w-[200px]"
                                    title={entry.card.title}
                                  >
                                    {entry.card.title}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-3">
                            <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {entry.description || (
                                <span className="italic text-gray-400 dark:text-gray-500">Pas de description</span>
                              )}
                            </span>
                          </td>

                          {/* Début */}
                          <td className="py-3 px-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(entry.startTime), 'HH:mm', { locale: fr })}
                            </span>
                          </td>

                          {/* Fin */}
                          <td className="py-3 px-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.endTime ? format(new Date(entry.endTime), 'HH:mm', { locale: fr }) : '—'}
                            </span>
                          </td>

                          {/* Durée */}
                          <td className="py-3 px-3 text-right">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {timeService.formatDuration(entry.duration || 0)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEntry(entry);
                              }}
                              className="text-sm text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium"
                            >
                              ✏️ Éditer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'édition */}
      {selectedEntry && (
        <TimeEntryModal
          entry={selectedEntry}
          card={selectedEntry.card}
          onSave={handleSave}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default TimeTrackerView;

