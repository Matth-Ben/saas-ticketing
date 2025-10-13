import { Request, Response } from 'express'
import { Quote, QuoteLine, Board, Card, TimeEntry } from '../models/index.js'
import { QuoteStatus, QuoteLineType } from '../models/Quote.js'
import { Op } from 'sequelize'

// Générer un numéro de devis unique
const generateQuoteNumber = async (): Promise<string> => {
  const year = new Date().getFullYear()
  const lastQuote = await Quote.findOne({
    where: {
      quoteNumber: {
        [Op.like]: `DEV-${year}-%`,
      },
    },
    order: [['quoteNumber', 'DESC']],
  })

  let nextNumber = 1
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2])
    nextNumber = lastNumber + 1
  }

  return `DEV-${year}-${nextNumber.toString().padStart(3, '0')}`
}

// Récupérer tous les devis d'un projet
export const getQuotesByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params

    const quotes = await Quote.findAll({
      where: { boardId },
      include: [
        {
          model: QuoteLine,
          as: 'lines',
          include: [
            {
              model: Card,
              as: 'card',
              attributes: ['id', 'key', 'title', 'status'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    res.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des devis' })
  }
}

// Récupérer un devis par ID
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const quote = await Quote.findByPk(id, {
      include: [
        {
          model: Board,
          as: 'board',
          attributes: ['id', 'name'],
        },
        {
          model: QuoteLine,
          as: 'lines',
          include: [
            {
              model: Card,
              as: 'card',
              attributes: ['id', 'key', 'title', 'status', 'estimatedTime', 'actualTime'],
            },
          ],
          order: [['lineNumber', 'ASC']],
        },
      ],
    })

    if (!quote) {
      return res.status(404).json({ error: 'Devis non trouvé' })
    }

    res.json(quote)
  } catch (error) {
    console.error('Error fetching quote:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération du devis' })
  }
}

// Créer un nouveau devis
export const createQuote = async (req: Request, res: Response) => {
  try {
    const {
      boardId,
      title,
      description,
      clientName,
      clientEmail,
      clientAddress,
      validUntil,
      hourlyRate,
      margin,
    } = req.body

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      return res.status(404).json({ error: 'Projet non trouvé' })
    }

    const quoteNumber = await generateQuoteNumber()

    const quote = await Quote.create({
      boardId,
      quoteNumber,
      title,
      description,
      clientName,
      clientEmail,
      clientAddress,
      validUntil: validUntil ? new Date(validUntil) : null,
      hourlyRate: parseFloat(hourlyRate) || 0,
      margin: parseFloat(margin) || 20,
      totalAmount: 0,
      totalHours: 0,
    })

    res.status(201).json(quote)
  } catch (error) {
    console.error('Error creating quote:', error)
    res.status(500).json({ error: 'Erreur lors de la création du devis' })
  }
}

// Mettre à jour un devis
export const updateQuote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const quote = await Quote.findByPk(id)
    if (!quote) {
      return res.status(404).json({ error: 'Devis non trouvé' })
    }

    // Convertir les dates si nécessaire
    if (updateData.validUntil) {
      updateData.validUntil = new Date(updateData.validUntil)
    }

    await quote.update(updateData)

    // Recalculer les totaux si nécessaire
    if (updateData.hourlyRate || updateData.margin) {
      await recalculateQuoteTotals(id)
    }

    const updatedQuote = await Quote.findByPk(id, {
      include: [
        {
          model: QuoteLine,
          as: 'lines',
          include: [
            {
              model: Card,
              as: 'card',
              attributes: ['id', 'key', 'title', 'status'],
            },
          ],
        },
      ],
    })

    res.json(updatedQuote)
  } catch (error) {
    console.error('Error updating quote:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour du devis' })
  }
}

// Supprimer un devis
export const deleteQuote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const quote = await Quote.findByPk(id)
    if (!quote) {
      return res.status(404).json({ error: 'Devis non trouvé' })
    }

    await quote.destroy()
    res.json({ message: 'Devis supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting quote:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression du devis' })
  }
}

// Ajouter une ligne au devis
export const addQuoteLine = async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params
    const {
      cardId,
      type,
      title,
      description,
      quantity,
      unitPrice,
      estimatedHours,
      category,
    } = req.body

    const quote = await Quote.findByPk(quoteId)
    if (!quote) {
      return res.status(404).json({ error: 'Devis non trouvé' })
    }

    // Obtenir le prochain numéro de ligne
    const lastLine = await QuoteLine.findOne({
      where: { quoteId },
      order: [['lineNumber', 'DESC']],
    })
    const lineNumber = (lastLine?.lineNumber || 0) + 1

    const totalPrice = parseFloat(quantity) * parseFloat(unitPrice)

    const quoteLine = await QuoteLine.create({
      quoteId,
      cardId,
      lineNumber,
      type,
      title,
      description,
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      totalPrice,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      category,
    })

    // Recalculer les totaux du devis
    await recalculateQuoteTotals(quoteId)

    res.status(201).json(quoteLine)
  } catch (error) {
    console.error('Error adding quote line:', error)
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la ligne' })
  }
}

// Mettre à jour une ligne de devis
export const updateQuoteLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const quoteLine = await QuoteLine.findByPk(id)
    if (!quoteLine) {
      return res.status(404).json({ error: 'Ligne de devis non trouvée' })
    }

    // Recalculer le prix total si quantité ou prix unitaire changent
    if (updateData.quantity || updateData.unitPrice) {
      const quantity = updateData.quantity || quoteLine.quantity
      const unitPrice = updateData.unitPrice || quoteLine.unitPrice
      updateData.totalPrice = parseFloat(quantity) * parseFloat(unitPrice)
    }

    await quoteLine.update(updateData)

    // Recalculer les totaux du devis
    await recalculateQuoteTotals(quoteLine.quoteId)

    res.json(quoteLine)
  } catch (error) {
    console.error('Error updating quote line:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la ligne' })
  }
}

// Supprimer une ligne de devis
export const deleteQuoteLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const quoteLine = await QuoteLine.findByPk(id)
    if (!quoteLine) {
      return res.status(404).json({ error: 'Ligne de devis non trouvée' })
    }

    const quoteId = quoteLine.quoteId
    await quoteLine.destroy()

    // Recalculer les totaux du devis
    await recalculateQuoteTotals(quoteId)

    res.json({ message: 'Ligne supprimée avec succès' })
  } catch (error) {
    console.error('Error deleting quote line:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de la ligne' })
  }
}

// Importer un devis depuis JSON ou CSV
export const importQuote = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params
    const { format, data } = req.body

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      return res.status(404).json({ error: 'Projet non trouvé' })
    }

    let importData: any[]

    if (format === 'json') {
      importData = Array.isArray(data) ? data : [data]
    } else if (format === 'csv') {
      // Parser le CSV (format simple)
      const lines = data.split('\n').filter((line: string) => line.trim())
      const headers = lines[0].split(',').map((h: string) => h.trim())
      
      importData = lines.slice(1).map((line: string) => {
        const values = line.split(',').map((v: string) => v.trim())
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ''
        })
        return obj
      })
    } else {
      return res.status(400).json({ error: 'Format non supporté' })
    }

    // Créer le devis
    const quoteNumber = await generateQuoteNumber()
    const quote = await Quote.create({
      boardId,
      quoteNumber,
      title: `Devis importé - ${new Date().toLocaleDateString('fr-FR')}`,
      clientName: 'Client importé',
      totalAmount: 0,
      totalHours: 0,
      hourlyRate: 0,
      margin: 20,
    })

    // Créer les lignes du devis
    let lineNumber = 1
    for (const item of importData) {
      const title = item.title || item.name || item.description || `Ligne ${lineNumber}`
      const quantity = parseFloat(item.quantity || item.qty || '1')
      const unitPrice = parseFloat(item.price || item.unitPrice || item.cost || '0')
      const totalPrice = quantity * unitPrice
      const estimatedHours = item.hours ? parseFloat(item.hours) : null

      await QuoteLine.create({
        quoteId: quote.id,
        lineNumber,
        type: QuoteLineType.TASK,
        title,
        description: item.description || item.desc || null,
        quantity,
        unitPrice,
        totalPrice,
        estimatedHours,
        category: item.category || null,
      })

      lineNumber++
    }

    // Recalculer les totaux
    await recalculateQuoteTotals(quote.id)

    // Récupérer le devis complet
    const completeQuote = await Quote.findByPk(quote.id, {
      include: [
        {
          model: QuoteLine,
          as: 'lines',
          order: [['lineNumber', 'ASC']],
        },
      ],
    })

    res.status(201).json(completeQuote)
  } catch (error) {
    console.error('Error importing quote:', error)
    res.status(500).json({ error: 'Erreur lors de l\'import du devis' })
  }
}

// Récupérer les tâches disponibles pour un devis
export const getAvailableTasks = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params
    const { includeCompleted } = req.query

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      return res.status(404).json({ error: 'Projet non trouvé' })
    }

    // Récupérer les tâches du projet
    const whereClause: any = { boardId, parentId: null } // Exclure les sous-tâches
    if (includeCompleted !== 'true') {
      whereClause.status = { [Op.ne]: 'Done' }
    }

    const cards = await Card.findAll({
      where: whereClause,
      attributes: ['id', 'key', 'title', 'description', 'status', 'estimatedTime', 'category'],
      order: [['position', 'ASC']],
    })

    res.json(cards)
  } catch (error) {
    console.error('Error fetching available tasks:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' })
  }
}

// Générer automatiquement un devis depuis les tâches du projet
export const generateQuoteFromTasks = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params
    const { hourlyRate, margin, includeCompleted, selectedCardIds, title, clientName } = req.body

    // Vérifier que le board existe
    const board = await Board.findByPk(boardId)
    if (!board) {
      return res.status(404).json({ error: 'Projet non trouvé' })
    }

    let cards: Card[] = []

    if (selectedCardIds && selectedCardIds.length > 0) {
      // Utiliser les tâches sélectionnées
      cards = await Card.findAll({
        where: {
          id: { [Op.in]: selectedCardIds },
          boardId,
          parentId: null, // Exclure les sous-tâches
        },
        order: [['position', 'ASC']],
      })
    } else {
      // Récupérer toutes les tâches du projet (comportement par défaut)
      const whereClause: any = { boardId, parentId: null }
      if (!includeCompleted) {
        whereClause.status = { [Op.ne]: 'Done' }
      }

      cards = await Card.findAll({
        where: whereClause,
        order: [['position', 'ASC']],
      })
    }

    if (cards.length === 0) {
      return res.status(400).json({ error: 'Aucune tâche trouvée dans ce projet' })
    }

    // Créer le devis
    const quoteNumber = await generateQuoteNumber()
    const quote = await Quote.create({
      boardId,
      quoteNumber,
      title: title || `Devis automatique - ${board.name}`,
      description: `Devis généré automatiquement depuis ${cards.length} tâche(s)`,
      clientName: clientName || 'Client à définir',
      totalAmount: 0,
      totalHours: 0,
      hourlyRate: parseFloat(hourlyRate) || 0,
      margin: parseFloat(margin) || 20,
    })

    // Créer les lignes du devis
    let lineNumber = 1
    let totalHours = 0

    for (const card of cards) {
      const estimatedHours = card.estimatedTime || 1 // Par défaut 1h si non défini
      const unitPrice = parseFloat(hourlyRate) * estimatedHours
      const totalPrice = unitPrice

      await QuoteLine.create({
        quoteId: quote.id,
        cardId: card.id,
        lineNumber,
        type: QuoteLineType.TASK,
        title: card.title,
        description: card.description || null,
        quantity: 1,
        unitPrice,
        totalPrice,
        estimatedHours,
        category: card.category || null,
      })

      totalHours += estimatedHours
      lineNumber++
    }

    // Mettre à jour les totaux du devis
    const totalAmount = totalHours * parseFloat(hourlyRate)
    await quote.update({
      totalHours,
      totalAmount,
    })

    // Récupérer le devis complet
    const completeQuote = await Quote.findByPk(quote.id, {
      include: [
        {
          model: QuoteLine,
          as: 'lines',
          include: [
            {
              model: Card,
              as: 'card',
              attributes: ['id', 'key', 'title', 'status'],
            },
          ],
          order: [['lineNumber', 'ASC']],
        },
      ],
    })

    res.status(201).json(completeQuote)
  } catch (error) {
    console.error('Error generating quote from tasks:', error)
    res.status(500).json({ error: 'Erreur lors de la génération du devis' })
  }
}

// Obtenir les statistiques de rentabilité
export const getProfitabilityStats = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params

    // Récupérer tous les devis du projet
    const quotes = await Quote.findAll({
      where: { boardId },
      include: [
        {
          model: QuoteLine,
          as: 'lines',
          include: [
            {
              model: Card,
              as: 'card',
              attributes: ['id', 'key', 'title', 'estimatedTime', 'actualTime'],
            },
          ],
        },
      ],
    })

    // Calculer les statistiques
    let totalEstimatedAmount = 0
    let totalActualAmount = 0
    let totalEstimatedHours = 0
    let totalActualHours = 0

    const profitabilityData = quotes.map((quote) => {
      const quoteEstimatedAmount = quote.totalAmount
      const quoteEstimatedHours = quote.totalHours

      // Calculer le temps réel depuis les TimeEntries
      let quoteActualHours = 0
      let quoteActualAmount = 0

      quote.lines.forEach((line) => {
        if (line.cardId && line.card) {
          // Récupérer les TimeEntries pour cette carte
          TimeEntry.findAll({
            where: { cardId: line.cardId },
          }).then((timeEntries) => {
            const cardActualHours = timeEntries.reduce(
              (sum, entry) => sum + (entry.duration || 0),
              0
            ) / 60 // Convertir minutes en heures

            quoteActualHours += cardActualHours
            quoteActualAmount += cardActualHours * quote.hourlyRate
          })
        }
      })

      totalEstimatedAmount += quoteEstimatedAmount
      totalActualAmount += quoteActualAmount
      totalEstimatedHours += quoteEstimatedHours
      totalActualHours += quoteActualHours

      return {
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        title: quote.title,
        estimatedAmount: quoteEstimatedAmount,
        actualAmount: quoteActualAmount,
        estimatedHours: quoteEstimatedHours,
        actualHours: quoteActualHours,
        margin: quote.margin,
        profitability: quoteActualAmount > 0 
          ? ((quoteEstimatedAmount - quoteActualAmount) / quoteActualAmount) * 100
          : 0,
      }
    })

    const overallProfitability = totalActualAmount > 0
      ? ((totalEstimatedAmount - totalActualAmount) / totalActualAmount) * 100
      : 0

    res.json({
      quotes: profitabilityData,
      summary: {
        totalEstimatedAmount,
        totalActualAmount,
        totalEstimatedHours,
        totalActualHours,
        overallProfitability,
        totalQuotes: quotes.length,
      },
    })
  } catch (error) {
    console.error('Error getting profitability stats:', error)
    res.status(500).json({ error: 'Erreur lors du calcul de la rentabilité' })
  }
}

// Fonction utilitaire pour recalculer les totaux d'un devis
const recalculateQuoteTotals = async (quoteId: string) => {
  const quote = await Quote.findByPk(quoteId)
  if (!quote) return

  const lines = await QuoteLine.findAll({
    where: { quoteId },
  })

  const totalAmount = lines.reduce((sum, line) => sum + parseFloat(line.totalPrice.toString()), 0)
  const totalHours = lines.reduce((sum, line) => sum + (line.estimatedHours || 0), 0)

  await quote.update({
    totalAmount,
    totalHours,
  })
}
