import { Router } from 'express'
import {
  getCardsByBoard,
  getCardById,
  createCard,
  updateCard,
  moveCard,
  deleteCard,
} from '../controllers/cardController.js'

const router = Router()

// Routes pour les cartes
router.get('/board/:boardId', getCardsByBoard)
router.get('/:id', getCardById)
router.post('/', createCard)
router.patch('/:id', updateCard)
router.patch('/:id/move', moveCard)
router.delete('/:id', deleteCard)

export default router

