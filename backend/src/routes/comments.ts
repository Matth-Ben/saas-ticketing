import { Router } from 'express'
import {
  getCommentsByCard,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js'

const router = Router()

// Routes pour les commentaires
router.get('/card/:cardId', getCommentsByCard)
router.post('/card/:cardId', createComment)
router.patch('/:commentId', updateComment)
router.delete('/:commentId', deleteComment)

export default router

