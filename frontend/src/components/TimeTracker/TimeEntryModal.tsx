import { useState, useEffect } from 'react';
import { timeService, TimeEntry } from '../../services/timeService';
import { Card } from '../../services/boardService';

interface TimeEntryModalProps {
  entry: TimeEntry;
  card?: Card;
  onSave: () => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

function TimeEntryModal({ entry, card, onSave, onClose, onDelete }: TimeEntryModalProps) {
  const [formData, setFormData] = useState({
    description: entry.description || '',
    startTime: entry.startTime.split('.')[0], // Format pour input datetime-local
    endTime: entry.endTime ? entry.endTime.split('.')[0] : '',
    duration: entry.duration?.toString() || '0',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Recalculer la durée si les dates changent
    if (field === 'startTime' || field === 'endTime') {
      const start = field === 'startTime' ? new Date(value) : new Date(formData.startTime);
      const end = field === 'endTime' ? new Date(value) : new Date(formData.endTime);

      if (start && end && end > start) {
        const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
        setFormData((prev) => ({ ...prev, duration: durationMinutes.toString() }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      await timeService.update(entry.id, {
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
        duration: parseInt(formData.duration),
      });

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de temps ?')) {
      return;
    }

    try {
      setLoading(true);
      await timeService.delete(entry.id);
      if (onDelete) onDelete(entry.id);
      onClose();
    } catch (err) {
      setError('Erreur lors de la suppression');
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Éditer l'entrée de temps</h2>
            {card && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {card.key} - {card.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Qu'avez-vous fait durant cette session ?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent"
            />
          </div>

          {/* Dates et durée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heure de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heure de début
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-300 focus:border-transparent"
                required
              />
            </div>

            {/* Heure de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heure de fin
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durée (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                min="0"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-300 focus:border-transparent"
                required
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                = {formatDuration(parseInt(formData.duration) || 0)}
              </span>
            </div>
          </div>

          {/* Info pause */}
          {entry.totalPauseDuration > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Cette session contient {timeService.formatDuration(entry.totalPauseDuration)} de pause
            </div>
          )}
        </form>

        {/* Footer avec boutons */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
          >
            🗑️ Supprimer
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeEntryModal;

