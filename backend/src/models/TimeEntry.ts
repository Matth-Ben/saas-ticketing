import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../config/database';

/**
 * Attributs d'une entrée de temps
 */
interface TimeEntryAttributes {
  id: string;
  cardId: string;
  userId?: string; // Optionnel pour le moment (pas encore d'auth)
  startTime: Date;
  endTime?: Date;
  duration?: number; // Durée en minutes
  description?: string;
  isPaused: boolean;
  pausedAt?: Date;
  totalPauseDuration: number; // Durée totale des pauses en minutes
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Attributs requis pour créer une entrée de temps
 */
interface TimeEntryCreationAttributes
  extends Optional<
    TimeEntryAttributes,
    'id' | 'endTime' | 'duration' | 'description' | 'isPaused' | 'pausedAt' | 'totalPauseDuration' | 'userId' | 'createdAt' | 'updatedAt'
  > {}

/**
 * Modèle TimeEntry
 * Représente une session de travail sur une tâche
 */
class TimeEntry extends Model<TimeEntryAttributes, TimeEntryCreationAttributes> implements TimeEntryAttributes {
  declare id: string;
  declare cardId: string;
  declare userId?: string;
  declare startTime: Date;
  declare endTime?: Date;
  declare duration?: number;
  declare description?: string;
  declare isPaused: boolean;
  declare pausedAt?: Date;
  declare totalPauseDuration: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TimeEntry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    cardId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cards',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'ID de la carte associée',
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID de l\'utilisateur (pour plus tard)',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Heure de début de la session',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Heure de fin de la session',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Durée totale en minutes',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description de ce qui a été fait',
    },
    isPaused: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indique si le timer est en pause',
    },
    pausedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Heure de la dernière mise en pause',
    },
    totalPauseDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Durée totale des pauses en minutes',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'time_entries',
    timestamps: true,
  }
);

export default TimeEntry;

