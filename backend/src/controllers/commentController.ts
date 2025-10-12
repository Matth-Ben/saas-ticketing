import { Request, Response, NextFunction } from 'express'
import { Card, Comment } from '../models/index.js'
import { createError } from '../utils/helpers.js'

/**
 * Récupérer les commentaires d'une carte
 */
export const getCommentsByCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params

    const card = await Card.findByPk(cardId)
    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    const comments = await Comment.findAll({
      where: { cardId },
      order: [['createdAt', 'DESC']],
    })

    res.json({
      success: true,
      data: comments,
      count: comments.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Créer un commentaire
 */
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const { author, content } = req.body

    if (!author || !content || content.trim() === '') {
      throw createError('L\'auteur et le contenu sont requis', 400)
    }

    const card = await Card.findByPk(cardId)
    if (!card) {
      throw createError('Carte non trouvée', 404)
    }

    const comment = await Comment.create({
      cardId,
      author: author.trim(),
      content: content.trim(),
    })

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Commentaire ajouté avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mettre à jour un commentaire
 */
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    if (!content || content.trim() === '') {
      throw createError('Le contenu est requis', 400)
    }

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      throw createError('Commentaire non trouvé', 404)
    }

    await comment.update({ content: content.trim() })

    res.json({
      success: true,
      data: comment,
      message: 'Commentaire mis à jour avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Supprimer un commentaire
 */
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      throw createError('Commentaire non trouvé', 404)
    }

    await comment.destroy()

    res.json({
      success: true,
      message: 'Commentaire supprimé avec succès',
    })
  } catch (error) {
    next(error)
  }
}

