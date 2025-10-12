import { Request, Response, NextFunction } from 'express'
import { Card, History } from '../models/index.js'
import { createError } from '../utils/helpers.js'

/**
 * Récupérer l'historique d'une carte
 */
export const getHistoryByCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params

    const card = await Card.findByPk(cardId)
    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    const history = await History.findAll({
      where: { cardId },
      order: [['createdAt', 'DESC']],
    })

    res.json({
      success: true,
      data: history,
      count: history.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Créer une entrée d'historique
 */
export const createHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const { user, action, field, oldValue, newValue } = req.body

    if (!user || !action) {
      throw createError('L\'utilisateur et l\'action sont requis', 400)
    }

    const card = await Card.findByPk(cardId)
    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    const historyEntry = await History.create({
      cardId,
      user: user.trim(),
      action: action.trim(),
      field,
      oldValue,
      newValue,
    })

    res.status(201).json({
      success: true,
      data: historyEntry,
      message: 'Entrée d\'historique créée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

