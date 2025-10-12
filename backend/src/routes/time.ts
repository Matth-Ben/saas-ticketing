import { Router } from 'express';
import {
  startTimeEntry,
  pauseTimeEntry,
  resumeTimeEntry,
  stopTimeEntry,
  getTimeEntriesByCard,
  getActiveTimeEntry,
  deleteTimeEntry,
  updateTimeEntry,
  getTimeReport,
  exportTimeEntries,
} from '../controllers/timeController.js';

const router = Router();

// Routes pour les entrées de temps
router.post('/start', startTimeEntry);
router.patch('/:id/pause', pauseTimeEntry);
router.patch('/:id/resume', resumeTimeEntry);
router.patch('/:id/stop', stopTimeEntry);
router.patch('/:id', updateTimeEntry);
router.delete('/:id', deleteTimeEntry);

// Récupérer les entrées par carte
router.get('/card/:cardId', getTimeEntriesByCard);
router.get('/card/:cardId/active', getActiveTimeEntry);

// Rapports et export
router.get('/report', getTimeReport);
router.get('/export', exportTimeEntries);

export default router;
