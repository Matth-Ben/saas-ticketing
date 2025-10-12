import { Router } from 'express'
import { getHistoryByCard, createHistory } from '../controllers/historyController.js'

const router = Router()

// Routes pour l'historique
router.get('/card/:cardId', getHistoryByCard)
router.post('/card/:cardId', createHistory)

export default router

