import { Request, Response, NextFunction } from 'express'
import { Card } from '../models/index.js'
import { createError } from '../utils/helpers.js'

/**
 * Récupérer les sous-tâches d'une carte
 */
export const getSubtasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params

    // Vérifier que la carte parent existe
    const parentCard = await Card.findByPk(cardId)
    if (!parentCard) {
      throw createError('Carte parente non trouvée', 404)
    }

    const subtasks = await Card.findAll({
      where: { parentId: cardId },
      order: [['position', 'ASC']],
    })

    res.json({
      success: true,
      data: subtasks,
      count: subtasks.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Créer une sous-tâche
 */
export const createSubtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const { title, description, status, priority } = req.body

    if (!title || title.trim() === '') {
      throw createError('Le titre est requis', 400)
    }

    // Vérifier que la carte parent existe
    const parentCard = await Card.findByPk(cardId)
    if (!parentCard) {
      throw createError('Carte parente non trouvée', 404)
    }

    // Trouver la position max pour les sous-tâches
    const maxPositionCard = await Card.findOne({
      where: { parentId: cardId },
      order: [['position', 'DESC']],
    })

    const position = maxPositionCard ? maxPositionCard.position + 1 : 0

    const subtask = await Card.create({
      parentId: cardId,
      boardId: parentCard.boardId,
      title: title.trim(),
      description: description?.trim(),
      status: status || 'To Do',
      priority: priority || 'medium',
      position,
    })

    res.status(201).json({
      success: true,
      data: subtask,
      message: 'Sous-tâche créée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mettre à jour une sous-tâche
 */
export const updateSubtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subtaskId } = req.params
    const updates = req.body

    const subtask = await Card.findByPk(subtaskId)

    if (!subtask || !subtask.parentId) {
      throw createError('Sous-tâche non trouvée', 404)
    }

    // Si le statut change vers "Done", on définit completedAt
    if (updates.status === 'Done' && subtask.status !== 'Done') {
      updates.completedAt = new Date()
    }

    // Si on revient de "Done", on retire completedAt
    if (subtask.status === 'Done' && updates.status !== 'Done') {
      updates.completedAt = null
    }

    await subtask.update(updates)

    res.json({
      success: true,
      data: subtask,
      message: 'Sous-tâche mise à jour avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Supprimer une sous-tâche
 */
export const deleteSubtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subtaskId } = req.params

    const subtask = await Card.findByPk(subtaskId)

    if (!subtask || !subtask.parentId) {
      throw createError('Sous-tâche non trouvée', 404)
    }

    await subtask.destroy()

    res.json({
      success: true,
      message: 'Sous-tâche supprimée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Obtenir les statistiques de progression d'une carte
 */
export const getCardProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params

    const parentCard = await Card.findByPk(cardId)
    if (!parentCard) {
      throw createError('Carte non trouvée', 404)
    }

    const subtasks = await Card.findAll({
      where: { parentId: cardId },
    })

    const total = subtasks.length
    const completed = subtasks.filter((st) => st.status === 'Done').length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    res.json({
      success: true,
      data: {
        total,
        completed,
        percentage,
        subtasks,
      },
    })
  } catch (error) {
    next(error)
  }
}

