import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TimeEntry {
  id: string;
  cardId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number; // en minutes
  description?: string;
  isPaused: boolean;
  pausedAt?: string;
  totalPauseDuration: number; // en minutes
  createdAt: string;
  updatedAt: string;
}

export interface TimeReport {
  report: TimeReportItem[];
  summary: {
    totalDuration: number;
    totalDurationHours: number;
    totalDurationMinutes: number;
    totalEntries: number;
    groupBy: 'card' | 'day' | 'project';
  };
}

export interface TimeReportItem {
  cardId?: string;
  cardTitle?: string;
  cardKey?: string;
  boardId?: string;
  boardName?: string;
  date?: string;
  totalDuration: number;
  entriesCount: number;
  entries: TimeEntry[];
}

class TimeService {
  /**
   * Démarrer une nouvelle session de temps
   */
  async start(cardId: string, userId?: string, description?: string): Promise<TimeEntry> {
    const response = await axios.post(`${API_URL}/time/start`, {
      cardId,
      userId,
      description,
    });
    return response.data;
  }

  /**
   * Mettre en pause une session
   */
  async pause(id: string): Promise<TimeEntry> {
    const response = await axios.patch(`${API_URL}/time/${id}/pause`);
    return response.data;
  }

  /**
   * Reprendre une session en pause
   */
  async resume(id: string): Promise<TimeEntry> {
    const response = await axios.patch(`${API_URL}/time/${id}/resume`);
    return response.data;
  }

  /**
   * Arrêter une session
   */
  async stop(id: string, description?: string): Promise<TimeEntry> {
    const response = await axios.patch(`${API_URL}/time/${id}/stop`, {
      description,
    });
    return response.data;
  }

  /**
   * Mettre à jour une entrée de temps
   */
  async update(id: string, data: Partial<TimeEntry>): Promise<TimeEntry> {
    const response = await axios.patch(`${API_URL}/time/${id}`, data);
    return response.data;
  }

  /**
   * Supprimer une entrée de temps
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/time/${id}`);
  }

  /**
   * Récupérer toutes les entrées de temps pour une carte
   */
  async getByCard(cardId: string): Promise<TimeEntry[]> {
    const response = await axios.get(`${API_URL}/time/card/${cardId}`);
    return response.data;
  }

  /**
   * Récupérer la session active pour une carte
   */
  async getActive(cardId: string): Promise<TimeEntry | null> {
    const response = await axios.get(`${API_URL}/time/card/${cardId}/active`);
    return response.data;
  }

  /**
   * Obtenir un rapport de temps
   */
  async getReport(params: {
    boardId?: string;
    startDate?: string;
    endDate?: string;
    groupBy?: 'card' | 'day' | 'project';
  }): Promise<TimeReport> {
    const response = await axios.get(`${API_URL}/time/report`, { params });
    return response.data;
  }

  /**
   * Exporter les entrées de temps en CSV
   */
  async exportCSV(params: {
    boardId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await axios.get(`${API_URL}/time/export`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Formater la durée en heures/minutes
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  }

  /**
   * Calculer la durée écoulée depuis le début (en secondes)
   */
  calculateElapsed(startTime: string, pausedAt?: string, totalPauseDuration: number = 0): number {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const elapsed = Math.floor((now - start) / 1000); // en secondes
    
    // Si en pause, calculer jusqu'au moment de la pause
    if (pausedAt) {
      const pauseTime = new Date(pausedAt).getTime();
      const elapsedUntilPause = Math.floor((pauseTime - start) / 1000);
      return elapsedUntilPause - (totalPauseDuration * 60); // totalPauseDuration est en minutes
    }
    
    return elapsed - (totalPauseDuration * 60); // totalPauseDuration est en minutes
  }
}

export const timeService = new TimeService();
export default timeService;

