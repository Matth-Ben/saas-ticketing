import { useState, useEffect } from 'react';
import { boardService, Board } from '../services/boardService';
import { timeService, TimeReport } from '../services/timeService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function Reports() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState<'card' | 'day' | 'project'>('card');
  const [report, setReport] = useState<TimeReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger les boards au montage
  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await boardService.getAll();
      setBoards(data);
    } catch (err) {
      console.error('Failed to load boards:', err);
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await timeService.getReport({
        boardId: selectedBoard || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        groupBy,
      });
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await timeService.exportCSV({
        boardId: selectedBoard || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `time-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Erreur lors de l\'export CSV');
    }
  };

  // Couleurs pour les graphiques
  const COLORS = ['#a8ff99', '#fbbf24', '#93c5fd', '#f87171', '#a78bfa', '#34d399'];

  // Préparer les données pour le graphique à barres
  const prepareBarData = () => {
    if (!report) return [];
    return report.report.map((item) => ({
      name: item.cardTitle || item.boardName || item.date || 'Unknown',
      duration: Math.round((item.totalDuration / 60) * 10) / 10, // Convertir en heures avec 1 décimale
      entries: item.entriesCount,
    }));
  };

  // Préparer les données pour le graphique circulaire
  const preparePieData = () => {
    if (!report) return [];
    return report.report.slice(0, 6).map((item) => ({
      name: item.cardTitle || item.boardName || item.date || 'Unknown',
      value: item.totalDuration,
    }));
  };

  return (
    <div className="h-full max-h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Rapports de temps</h1>
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2"
          >
            📥 Exporter CSV
          </button>
        </div>

        {/* Filtres */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Projet
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="input"
              >
                <option value="">Tous les projets</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </div>

            {/* Date de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
            </div>

            {/* Grouper par */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grouper par
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as 'card' | 'day' | 'project')}
                className="input"
              >
                <option value="card">Carte</option>
                <option value="day">Jour</option>
                <option value="project">Projet</option>
              </select>
            </div>
          </div>

          <button
            onClick={loadReport}
            disabled={loading}
            className="btn-primary mt-4 w-full md:w-auto"
          >
            {loading ? 'Chargement...' : '🔍 Générer le rapport'}
          </button>
        </div>

        {/* Résumé */}
        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Temps total</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {report.summary.totalDurationHours}h {report.summary.totalDurationMinutes}m
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {report.summary.totalDuration} minutes au total
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Sessions</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {report.summary.totalEntries}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Entrées de temps enregistrées
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Moyenne par session</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {report.summary.totalEntries > 0
                    ? Math.round(report.summary.totalDuration / report.summary.totalEntries)
                    : 0}
                  m
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Minutes par session
                </p>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Graphique à barres */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Temps par {groupBy === 'card' ? 'Carte' : groupBy === 'day' ? 'Jour' : 'Projet'}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareBarData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                      label={{ value: 'Heures', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6',
                      }}
                      formatter={(value: any) => [`${value}h`, 'Durée']}
                    />
                    <Bar dataKey="duration" fill="#a8ff99" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique circulaire */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Répartition du temps (Top 6)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={preparePieData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6',
                      }}
                      formatter={(value: any) => [`${timeService.formatDuration(value)}`, 'Durée']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tableau détaillé */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Détails</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {groupBy === 'card' ? 'Carte' : groupBy === 'day' ? 'Date' : 'Projet'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Temps total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Moyenne
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {report.report.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {groupBy === 'card' && (
                            <>
                              <span className="font-medium">{item.cardKey}</span>
                              <span className="ml-2 text-gray-500 dark:text-gray-400">{item.cardTitle}</span>
                              {item.boardName && (
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  📁 {item.boardName}
                                </div>
                              )}
                            </>
                          )}
                          {groupBy === 'day' && item.date}
                          {groupBy === 'project' && item.boardName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.entriesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {timeService.formatDuration(item.totalDuration)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {timeService.formatDuration(Math.round(item.totalDuration / item.entriesCount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Message vide */}
        {!report && !loading && (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sélectionnez vos filtres et cliquez sur "Générer le rapport" pour voir vos statistiques de temps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
