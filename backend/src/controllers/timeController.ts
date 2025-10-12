import { Request, Response, NextFunction } from 'express';
import TimeEntry from '../models/TimeEntry';
import Card from '../models/Card';
import Board from '../models/Board';
import { Op } from 'sequelize';

/**
 * Démarrer une nouvelle session de temps
 */
export const startTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId, userId, description } = req.body;

    // Vérifier que la carte existe
    const card = await Card.findByPk(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    // Vérifier s'il y a déjà une session active pour cette carte
    const activeEntry = await TimeEntry.findOne({
      where: {
        cardId,
        endTime: null,
      },
    });

    if (activeEntry) {
      return res.status(400).json({ message: 'Une session est déjà en cours pour cette carte' });
    }

    // Créer la nouvelle entrée
    const timeEntry = await TimeEntry.create({
      cardId,
      userId: userId || 'anonymous',
      startTime: new Date(),
      description,
      isPaused: false,
      totalPauseDuration: 0,
    });

    res.status(201).json(timeEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre en pause une session de temps
 */
export const pauseTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const timeEntry = await TimeEntry.findByPk(id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Entrée de temps non trouvée' });
    }

    if (timeEntry.endTime) {
      return res.status(400).json({ message: 'Cette session est déjà terminée' });
    }

    if (timeEntry.isPaused) {
      return res.status(400).json({ message: 'Cette session est déjà en pause' });
    }

    timeEntry.isPaused = true;
    timeEntry.pausedAt = new Date();
    await timeEntry.save();

    res.json(timeEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Reprendre une session en pause
 */
export const resumeTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const timeEntry = await TimeEntry.findByPk(id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Entrée de temps non trouvée' });
    }

    if (!timeEntry.isPaused) {
      return res.status(400).json({ message: 'Cette session n\'est pas en pause' });
    }

    if (timeEntry.pausedAt) {
      const pauseDuration = Math.floor((new Date().getTime() - timeEntry.pausedAt.getTime()) / 1000 / 60);
      timeEntry.totalPauseDuration += pauseDuration;
    }

    timeEntry.isPaused = false;
    timeEntry.pausedAt = undefined;
    await timeEntry.save();

    res.json(timeEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Arrêter une session de temps
 */
export const stopTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const timeEntry = await TimeEntry.findByPk(id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Entrée de temps non trouvée' });
    }

    if (timeEntry.endTime) {
      return res.status(400).json({ message: 'Cette session est déjà terminée' });
    }

    // Si en pause, compter la durée de pause actuelle
    if (timeEntry.isPaused && timeEntry.pausedAt) {
      const pauseDuration = Math.floor((new Date().getTime() - timeEntry.pausedAt.getTime()) / 1000 / 60);
      timeEntry.totalPauseDuration += pauseDuration;
    }

    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - timeEntry.startTime.getTime()) / 1000 / 60);
    const workDuration = totalDuration - timeEntry.totalPauseDuration;

    timeEntry.endTime = endTime;
    timeEntry.duration = workDuration > 0 ? workDuration : 0;
    timeEntry.isPaused = false;
    timeEntry.pausedAt = undefined;
    
    if (description) {
      timeEntry.description = description;
    }

    await timeEntry.save();

    // Mettre à jour le temps réel de la carte
    const card = await Card.findByPk(timeEntry.cardId);
    if (card) {
      const totalTimeSpent = await TimeEntry.sum('duration', {
        where: {
          cardId: timeEntry.cardId,
          duration: { [Op.not]: null },
        },
      });

      card.actualTime = Math.floor((totalTimeSpent || 0) / 60); // Convertir minutes en heures
      await card.save();
    }

    res.json(timeEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer toutes les entrées de temps pour une carte
 */
export const getTimeEntriesByCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const timeEntries = await TimeEntry.findAll({
      where: { cardId },
      order: [['startTime', 'DESC']],
    });

    res.json(timeEntries);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer la session active pour une carte
 */
export const getActiveTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const activeEntry = await TimeEntry.findOne({
      where: {
        cardId,
        endTime: null,
      },
    });

    res.json(activeEntry || null);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une entrée de temps
 */
export const deleteTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const timeEntry = await TimeEntry.findByPk(id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Entrée de temps non trouvée' });
    }

    await timeEntry.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une entrée de temps (description, etc.)
 */
export const updateTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { description, startTime, endTime, duration } = req.body;

    const timeEntry = await TimeEntry.findByPk(id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Entrée de temps non trouvée' });
    }

    if (description !== undefined) timeEntry.description = description;
    if (startTime) timeEntry.startTime = new Date(startTime);
    if (endTime) timeEntry.endTime = new Date(endTime);
    if (duration !== undefined) timeEntry.duration = duration;

    await timeEntry.save();
    res.json(timeEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Rapport de temps par projet
 */
export const getTimeReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, startDate, endDate, groupBy = 'card' } = req.query;

    const whereClause: any = {
      duration: { [Op.not]: null },
    };

    // Filtrer par dates
    if (startDate) {
      whereClause.startTime = { [Op.gte]: new Date(startDate as string) };
    }
    if (endDate) {
      if (whereClause.startTime) {
        whereClause.startTime = {
          ...whereClause.startTime,
          [Op.lte]: new Date(endDate as string),
        };
      } else {
        whereClause.startTime = { [Op.lte]: new Date(endDate as string) };
      }
    }

    // Récupérer les entrées avec les cartes et boards
    const timeEntries = await TimeEntry.findAll({
      where: whereClause,
      include: [
        {
          model: Card,
          as: 'card',
          attributes: ['id', 'title', 'key', 'boardId'],
          include: [
            {
              model: Board,
              as: 'board',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['startTime', 'DESC']],
    });

    // Filtrer par board si spécifié
    let filteredEntries = timeEntries;
    if (boardId) {
      filteredEntries = timeEntries.filter((entry: any) => entry.card?.boardId === boardId);
    }

    // Grouper les données
    let report: any = {};

    if (groupBy === 'card') {
      // Grouper par carte
      report = filteredEntries.reduce((acc: any, entry: any) => {
        const cardId = entry.cardId;
        if (!acc[cardId]) {
          acc[cardId] = {
            cardId,
            cardTitle: entry.card?.title || 'Unknown',
            cardKey: entry.card?.key || 'N/A',
            boardName: entry.card?.board?.name || 'Unknown',
            totalDuration: 0,
            entriesCount: 0,
            entries: [],
          };
        }
        acc[cardId].totalDuration += entry.duration || 0;
        acc[cardId].entriesCount += 1;
        acc[cardId].entries.push(entry);
        return acc;
      }, {});
    } else if (groupBy === 'day') {
      // Grouper par jour
      report = filteredEntries.reduce((acc: any, entry: any) => {
        const day = entry.startTime.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = {
            date: day,
            totalDuration: 0,
            entriesCount: 0,
            entries: [],
          };
        }
        acc[day].totalDuration += entry.duration || 0;
        acc[day].entriesCount += 1;
        acc[day].entries.push(entry);
        return acc;
      }, {});
    } else if (groupBy === 'project') {
      // Grouper par projet
      report = filteredEntries.reduce((acc: any, entry: any) => {
        const boardId = entry.card?.boardId || 'unknown';
        if (!acc[boardId]) {
          acc[boardId] = {
            boardId,
            boardName: entry.card?.board?.name || 'Unknown',
            totalDuration: 0,
            entriesCount: 0,
            entries: [],
          };
        }
        acc[boardId].totalDuration += entry.duration || 0;
        acc[boardId].entriesCount += 1;
        acc[boardId].entries.push(entry);
        return acc;
      }, {});
    }

    // Calculer les statistiques globales
    const totalDuration = filteredEntries.reduce((sum: number, entry: any) => sum + (entry.duration || 0), 0);
    const totalEntries = filteredEntries.length;

    res.json({
      report: Object.values(report),
      summary: {
        totalDuration, // en minutes
        totalDurationHours: Math.floor(totalDuration / 60),
        totalDurationMinutes: totalDuration % 60,
        totalEntries,
        groupBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Exporter les données en CSV
 */
export const exportTimeEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, startDate, endDate } = req.query;

    const whereClause: any = {
      duration: { [Op.not]: null },
    };

    if (startDate) {
      whereClause.startTime = { [Op.gte]: new Date(startDate as string) };
    }
    if (endDate) {
      if (whereClause.startTime) {
        whereClause.startTime = {
          ...whereClause.startTime,
          [Op.lte]: new Date(endDate as string),
        };
      } else {
        whereClause.startTime = { [Op.lte]: new Date(endDate as string) };
      }
    }

    const timeEntries = await TimeEntry.findAll({
      where: whereClause,
      include: [
        {
          model: Card,
          as: 'card',
          attributes: ['id', 'title', 'key', 'boardId'],
          include: [
            {
              model: Board,
              as: 'board',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['startTime', 'DESC']],
    });

    // Filtrer par board
    let filteredEntries = timeEntries;
    if (boardId) {
      filteredEntries = timeEntries.filter((entry: any) => entry.card?.boardId === boardId);
    }

    // Générer le CSV
    const csvHeader = 'Project,Card Key,Card Title,Start Time,End Time,Duration (min),Duration (hours),Description,User\n';
    const csvRows = filteredEntries.map((entry: any) => {
      const projectName = entry.card?.board?.name || 'Unknown';
      const cardKey = entry.card?.key || 'N/A';
      const cardTitle = entry.card?.title || 'Unknown';
      const startTime = entry.startTime.toISOString();
      const endTime = entry.endTime ? entry.endTime.toISOString() : '';
      const duration = entry.duration || 0;
      const durationHours = (duration / 60).toFixed(2);
      const description = (entry.description || '').replace(/"/g, '""');
      const user = entry.userId || 'anonymous';

      return `"${projectName}","${cardKey}","${cardTitle}","${startTime}","${endTime}",${duration},${durationHours},"${description}","${user}"`;
    });

    const csv = csvHeader + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=time-entries.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

