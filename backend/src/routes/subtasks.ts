import { Router } from 'express'
import {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  getCardProgress,
} from '../controllers/subtaskController.js'

const router = Router()

// Routes pour les sous-tâches
router.get('/card/:cardId', getSubtasks)
router.post('/card/:cardId', createSubtask)
router.patch('/:subtaskId', updateSubtask)
router.delete('/:subtaskId', deleteSubtask)
router.get('/card/:cardId/progress', getCardProgress)

export default router

