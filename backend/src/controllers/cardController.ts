import { Request, Response, NextFunction } from 'express'
import { Card, Board, Comment, History } from '../models/index.js'
import { createError } from '../utils/helpers.js'
import { Op } from 'sequelize'

/**
 * Récupérer toutes les cartes d'un board (sans les sous-tâches)
 */
export const getCardsByBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId } = req.params
    const { status, priority, search } = req.query

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Construction des filtres
    const where: any = { 
      boardId,
      parentId: null, // Exclure les sous-tâches
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (search && typeof search === 'string') {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ]
    }

    const cards = await Card.findAll({
      where,
      include: [
        {
          model: Card,
          as: 'subtasks',
          order: [['position', 'ASC']],
        },
      ],
      order: [
        ['status', 'ASC'],
        ['position', 'ASC'],
      ],
    })

    res.json({
      success: true,
      data: cards,
      count: cards.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Récupérer une carte par ID avec ses sous-tâches
 */
export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const card = await Card.findByPk(id, {
      include: [
        {
          model: Card,
          as: 'subtasks',
          order: [['position', 'ASC']],
        },
        {
          model: Comment,
          as: 'comments',
          order: [['createdAt', 'DESC']],
        },
        {
          model: History,
          as: 'history',
          order: [['createdAt', 'DESC']],
        },
      ],
    })

    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    res.json({
      success: true,
      data: card,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Créer une nouvelle carte
 */
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, title, description, status, priority, assignee, estimatedTime, dueDate, reporter, category, labels } =
      req.body

    if (!boardId || !title || title.trim() === '') {
      throw createError('Le boardId et le titre sont requis', 400)
    }

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Générer une clé unique (BOARD-XXX)
    const boardPrefix = board.name
      .toUpperCase()
      .substring(0, 4)
      .replace(/[^A-Z]/g, '')
      .padEnd(4, 'X')
    
    // Trouver le numéro suivant pour ce board
    const lastCard = await Card.findOne({
      where: { boardId, parentId: null },
      order: [['createdAt', 'DESC']],
    })

    let cardNumber = 1
    if (lastCard && lastCard.key) {
      const match = lastCard.key.match(/-(\d+)$/)
      if (match) {
        cardNumber = parseInt(match[1]) + 1
      }
    }

    const key = `${boardPrefix}-${cardNumber}`

    // Trouver la position max pour ce statut
    const maxPositionCard = await Card.findOne({
      where: { boardId, status: status || 'To Do' },
      order: [['position', 'DESC']],
    })

    const position = maxPositionCard ? maxPositionCard.position + 1 : 0

    const card = await Card.create({
      boardId,
      key,
      title: title.trim(),
      description: description?.trim(),
      status: status || 'To Do',
      priority: priority || 'medium',
      position,
      assignee,
      reporter,
      category,
      labels: labels || [],
      estimatedTime,
      dueDate,
      startDate: status === 'In Progress' ? new Date() : undefined,
    })

    res.status(201).json({
      success: true,
      data: card,
      message: 'Carte créée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mettre à jour une carte
 */
export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body

    const card = await Card.findByPk(id)

    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    // Si le statut change vers "In Progress" et pas de startDate, on la définit
    if (updates.status === 'In Progress' && !card.startDate) {
      updates.startDate = new Date()
    }

    // Si le statut change vers "Done", on définit completedAt
    if (updates.status === 'Done' && card.status !== 'Done') {
      updates.completedAt = new Date()
    }

    // Si on revient de "Done", on retire completedAt
    if (card.status === 'Done' && updates.status !== 'Done') {
      updates.completedAt = null
    }

    await card.update(updates)

    res.json({
      success: true,
      data: card,
      message: 'Carte mise à jour avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Déplacer une carte (drag & drop)
 */
export const moveCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status, position } = req.body

    if (!status || position === undefined) {
      throw createError('Status et position sont requis', 400)
    }

    const card = await Card.findByPk(id)

    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    const oldStatus = card.status
    const newStatus = status

    // Mise à jour des dates selon le statut
    const updates: any = { status, position }

    if (newStatus === 'In Progress' && !card.startDate) {
      updates.startDate = new Date()
    }

    if (newStatus === 'Done' && oldStatus !== 'Done') {
      updates.completedAt = new Date()
    }

    if (oldStatus === 'Done' && newStatus !== 'Done') {
      updates.completedAt = null
    }

    await card.update(updates)

    res.json({
      success: true,
      data: card,
      message: 'Carte déplacée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Supprimer une carte
 */
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const card = await Card.findByPk(id)

    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    await card.destroy()

    res.json({
      success: true,
      message: 'Carte supprimée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

