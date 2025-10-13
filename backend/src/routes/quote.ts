import { Router } from 'express'
import {
  getQuotesByBoard,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  addQuoteLine,
  updateQuoteLine,
  deleteQuoteLine,
  importQuote,
  getAvailableTasks,
  generateQuoteFromTasks,
  getProfitabilityStats,
} from '../controllers/quoteController.js'

const router = Router()

// Routes pour les devis
router.get('/board/:boardId', getQuotesByBoard)
router.get('/:id', getQuoteById)
router.post('/', createQuote)
router.put('/:id', updateQuote)
router.delete('/:id', deleteQuote)

// Routes pour les lignes de devis
router.post('/:quoteId/lines', addQuoteLine)
router.put('/lines/:id', updateQuoteLine)
router.delete('/lines/:id', deleteQuoteLine)

// Routes spéciales
router.get('/board/:boardId/tasks', getAvailableTasks)
router.post('/board/:boardId/import', importQuote)
router.post('/board/:boardId/generate', generateQuoteFromTasks)
router.get('/board/:boardId/profitability', getProfitabilityStats)

export default router
