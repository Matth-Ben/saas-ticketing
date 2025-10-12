import { Request, Response, NextFunction } from 'express'
import { Board, Card } from '../models/index.js'
import { createError } from '../utils/helpers.js'

/**
 * Récupérer tous les boards
 */
export const getAllBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boards = await Board.findAll({
      include: [
        {
          model: Card,
          as: 'cards',
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    res.json({
      success: true,
      data: boards,
      count: boards.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Récupérer un board par ID
 */
export const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const board = await Board.findByPk(id, {
      include: [
        {
          model: Card,
          as: 'cards',
          order: [['position', 'ASC']],
        },
      ],
    })

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    res.json({
      success: true,
      data: board,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Créer un nouveau board
 */
export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, color, columns } = req.body

    if (!name || name.trim() === '') {
      throw createError('Le nom du board est requis', 400)
    }

    const board = await Board.create({
      name: name.trim(),
      description: description?.trim(),
      color,
      columns: columns || ['To Do', 'In Progress', 'Done'],
    })

    res.status(201).json({
      success: true,
      data: board,
      message: 'Board créé avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mettre à jour un board
 */
export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, description, color, columns } = req.body

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    await board.update({
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() }),
      ...(color && { color }),
      ...(columns && { columns }),
    })

    res.json({
      success: true,
      data: board,
      message: 'Board mis à jour avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Supprimer un board
 */
export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    await board.destroy()

    res.json({
      success: true,
      message: 'Board supprimé avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Ajouter une colonne à un board
 */
export const addColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { columnName, color } = req.body

    if (!columnName || columnName.trim() === '') {
      throw createError('Le nom de la colonne est requis', 400)
    }

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Vérifier si la colonne existe déjà
    if (board.columns.includes(columnName.trim())) {
      throw createError('Cette colonne existe déjà', 400)
    }

    // Générer une couleur aléatoire si non fournie
    const defaultColors = ['#93c5fd', '#fbbf24', '#a8ff99', '#f472b6', '#a78bfa', '#34d399', '#fb923c', '#38bdf8']
    const columnColor = color || defaultColors[Math.floor(Math.random() * defaultColors.length)]

    // Ajouter la nouvelle colonne
    const updatedColumns = [...board.columns, columnName.trim()]
    const updatedColumnColors = { ...board.columnColors, [columnName.trim()]: columnColor }
    
    await board.update({ 
      columns: updatedColumns,
      columnColors: updatedColumnColors
    })

    res.json({
      success: true,
      data: board,
      message: 'Colonne ajoutée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Renommer une colonne
 */
export const renameColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { oldName, newName } = req.body

    if (!oldName || !newName || newName.trim() === '') {
      throw createError('Les noms ancien et nouveau sont requis', 400)
    }

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Vérifier que l'ancienne colonne existe
    if (!board.columns.includes(oldName)) {
      throw createError('Colonne non trouvée', 404)
    }

    // Vérifier que le nouveau nom n'existe pas déjà
    if (oldName !== newName.trim() && board.columns.includes(newName.trim())) {
      throw createError('Une colonne avec ce nom existe déjà', 400)
    }

    // Mettre à jour le nom de la colonne
    const updatedColumns = board.columns.map((col) => (col === oldName ? newName.trim() : col))
    
    // Mettre à jour les couleurs (renommer la clé)
    const updatedColumnColors = { ...board.columnColors }
    if (updatedColumnColors[oldName]) {
      updatedColumnColors[newName.trim()] = updatedColumnColors[oldName]
      delete updatedColumnColors[oldName]
    }
    
    await board.update({ 
      columns: updatedColumns,
      columnColors: updatedColumnColors
    })

    // Mettre à jour le statut de toutes les cartes de cette colonne
    await Card.update({ status: newName.trim() }, { where: { boardId: id, status: oldName } })

    res.json({
      success: true,
      data: board,
      message: 'Colonne renommée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Supprimer une colonne
 */
export const deleteColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { columnName } = req.body

    if (!columnName) {
      throw createError('Le nom de la colonne est requis', 400)
    }

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Vérifier que la colonne existe
    if (!board.columns.includes(columnName)) {
      throw createError('Colonne non trouvée', 404)
    }

    // Vérifier qu'il reste au moins une colonne
    if (board.columns.length <= 1) {
      throw createError('Impossible de supprimer la dernière colonne', 400)
    }

    // Vérifier s'il y a des cartes dans cette colonne
    const cardsInColumn = await Card.count({ where: { boardId: id, status: columnName } })

    if (cardsInColumn > 0) {
      throw createError(
        `Impossible de supprimer cette colonne : elle contient ${cardsInColumn} carte(s)`,
        400
      )
    }

    // Supprimer la colonne
    const updatedColumns = board.columns.filter((col) => col !== columnName)
    
    // Supprimer la couleur associée
    const updatedColumnColors = { ...board.columnColors }
    delete updatedColumnColors[columnName]
    
    await board.update({ 
      columns: updatedColumns,
      columnColors: updatedColumnColors
    })

    res.json({
      success: true,
      data: board,
      message: 'Colonne supprimée avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Mettre à jour la couleur d'une colonne
 */
export const updateColumnColor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { columnName, color } = req.body

    if (!columnName || !color) {
      throw createError('Le nom de la colonne et la couleur sont requis', 400)
    }

    // Valider le format de la couleur
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw createError('Format de couleur invalide (hex requis: #RRGGBB)', 400)
    }

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Vérifier que la colonne existe
    if (!board.columns.includes(columnName)) {
      throw createError('Colonne non trouvée', 404)
    }

    // Mettre à jour la couleur
    const updatedColumnColors = { ...board.columnColors, [columnName]: color }
    await board.update({ columnColors: updatedColumnColors })

    res.json({
      success: true,
      data: board,
      message: 'Couleur de la colonne mise à jour avec succès',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Réorganiser les colonnes
 */
export const reorderColumns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { columns } = req.body

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      throw createError('La liste des colonnes est invalide', 400)
    }

    const board = await Board.findByPk(id)

    if (!board) {
      throw createError('Board non trouvé', 404)
    }

    // Vérifier que toutes les colonnes actuelles sont présentes
    const currentColumns = board.columns.sort()
    const newColumns = [...columns].sort()

    if (
      currentColumns.length !== newColumns.length ||
      !currentColumns.every((col, idx) => col === newColumns[idx])
    ) {
      throw createError('La liste des colonnes ne correspond pas', 400)
    }

    // Mettre à jour l'ordre des colonnes
    await board.update({ columns })

    res.json({
      success: true,
      data: board,
      message: 'Colonnes réorganisées avec succès',
    })
  } catch (error) {
    next(error)
  }
}

