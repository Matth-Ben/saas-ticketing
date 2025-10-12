import { Router } from 'express'
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  renameColumn,
  deleteColumn,
  updateColumnColor,
  reorderColumns,
} from '../controllers/boardController.js'

const router = Router()

// Routes pour les boards
router.get('/', getAllBoards)
router.post('/', createBoard)
router.get('/:id', getBoardById)
router.patch('/:id', updateBoard)
router.delete('/:id', deleteBoard)

// Routes pour la gestion des colonnes
router.post('/:id/columns', addColumn)
router.patch('/:id/columns/rename', renameColumn)
router.patch('/:id/columns/color', updateColumnColor)
router.delete('/:id/columns', deleteColumn)
router.patch('/:id/columns/reorder', reorderColumns)

export default router

