import { useState, useEffect, useRef } from 'react';
import { timeService, TimeEntry } from '../../services/timeService';

interface TimeTrackerProps {
  cardId: string;
  compact?: boolean; // Mode compact pour CardItem
  onTimeUpdate?: () => void; // Callback quand le temps change
}

function TimeTracker({ cardId, compact = false, onTimeUpdate }: TimeTrackerProps) {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Charger la session active au montage
  useEffect(() => {
    loadActiveEntry();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cardId]);

  // Mettre à jour le compteur toutes les secondes si une session est active
  useEffect(() => {
    if (activeEntry && !activeEntry.isPaused) {
      intervalRef.current = setInterval(() => {
        const newElapsed = timeService.calculateElapsed(
          activeEntry.startTime,
          activeEntry.pausedAt,
          activeEntry.totalPauseDuration
        );
        setElapsed(newElapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeEntry]);

  const loadActiveEntry = async () => {
    try {
      const entry = await timeService.getActive(cardId);
      setActiveEntry(entry);
      
      if (entry) {
        const currentElapsed = timeService.calculateElapsed(
          entry.startTime,
          entry.pausedAt,
          entry.totalPauseDuration
        );
        setElapsed(currentElapsed);
      } else {
        setElapsed(0);
      }
    } catch (err) {
      console.error('Failed to load active time entry:', err);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);
      const entry = await timeService.start(cardId);
      setActiveEntry(entry);
      setElapsed(0);
      if (onTimeUpdate) onTimeUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du démarrage');
      console.error('Failed to start timer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    if (!activeEntry) return;

    try {
      setLoading(true);
      setError(null);
      const entry = await timeService.pause(activeEntry.id);
      setActiveEntry(entry);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise en pause');
      console.error('Failed to pause timer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!activeEntry) return;

    try {
      setLoading(true);
      setError(null);
      const entry = await timeService.resume(activeEntry.id);
      setActiveEntry(entry);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la reprise');
      console.error('Failed to resume timer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeEntry) return;

    try {
      setLoading(true);
      setError(null);
      await timeService.stop(activeEntry.id);
      setActiveEntry(null);
      setElapsed(0);
      if (onTimeUpdate) onTimeUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'arrêt');
      console.error('Failed to stop timer:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (compact) {
      // Pour le mode compact, on affiche en minutes
      const totalMinutes = Math.floor(seconds / 60);
      return timeService.formatDuration(totalMinutes);
    }
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode compact pour CardItem
  if (compact) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {activeEntry ? (
          <>
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              ⏱️ {formatTime(elapsed)}
            </span>
            {activeEntry.isPaused ? (
              <button
                onClick={handleResume}
                disabled={loading}
                className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50"
                title="Reprendre"
              >
                ▶️
              </button>
            ) : (
              <button
                onClick={handlePause}
                disabled={loading}
                className="text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors disabled:opacity-50"
                title="Pause"
              >
                ⏸️
              </button>
            )}
            <button
              onClick={handleStop}
              disabled={loading}
              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
              title="Arrêter"
            >
              ⏹️
            </button>
          </>
        ) : (
          <button
            onClick={handleStart}
            disabled={loading}
            className="text-xs px-2 py-1 bg-secondary-500 hover:bg-secondary-600 text-primary-900 rounded transition-colors disabled:opacity-50"
            title="Démarrer le timer"
          >
            ▶️ Start
          </button>
        )}
      </div>
    );
  }

  // Mode normal pour CardModal
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⏱️ Suivi du temps</h3>
        {activeEntry && (
          <span
            className={`text-2xl font-mono ${
              activeEntry.isPaused ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
            }`}
          >
            {formatTime(elapsed)}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {!activeEntry ? (
          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            ▶️ Démarrer
          </button>
        ) : (
          <>
            {activeEntry.isPaused ? (
              <button
                onClick={handleResume}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                ▶️ Reprendre
              </button>
            ) : (
              <button
                onClick={handlePause}
                disabled={loading}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                ⏸️ Pause
              </button>
            )}
            <button
              onClick={handleStop}
              disabled={loading}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              ⏹️ Arrêter
            </button>
          </>
        )}
      </div>

      {activeEntry && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex justify-between">
            <span>Statut:</span>
            <span className="font-medium">
              {activeEntry.isPaused ? '⏸️ En pause' : '▶️ En cours'}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Débuté à:</span>
            <span className="font-medium">
              {new Date(activeEntry.startTime).toLocaleTimeString('fr-FR')}
            </span>
          </div>
          {activeEntry.totalPauseDuration > 0 && (
            <div className="flex justify-between mt-1">
              <span>Temps de pause:</span>
              <span className="font-medium">
                {timeService.formatDuration(activeEntry.totalPauseDuration)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TimeTracker;

