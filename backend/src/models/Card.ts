import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

export enum CardPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

interface CardAttributes {
  id: string
  boardId: string
  parentId?: string
  key: string
  title: string
  description?: string
  status: string
  priority: CardPriority
  position: number
  assignee?: string
  reporter?: string
  category?: string
  labels?: string[]
  estimatedTime?: number
  actualTime?: number
  startDate?: Date
  dueDate?: Date
  completedAt?: Date
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

interface CardCreationAttributes
  extends Optional<
    CardAttributes,
    | 'id'
    | 'parentId'
    | 'key'
    | 'description'
    | 'priority'
    | 'position'
    | 'assignee'
    | 'reporter'
    | 'category'
    | 'labels'
    | 'estimatedTime'
    | 'actualTime'
    | 'startDate'
    | 'dueDate'
    | 'completedAt'
    | 'tags'
  > {}

class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  declare id: string
  declare boardId: string
  declare parentId?: string
  declare key: string
  declare title: string
  declare description?: string
  declare status: string
  declare priority: CardPriority
  declare position: number
  declare assignee?: string
  declare reporter?: string
  declare category?: string
  declare labels?: string[]
  declare estimatedTime?: number
  declare actualTime?: number
  declare startDate?: Date
  declare dueDate?: Date
  declare completedAt?: Date
  declare tags?: string[]
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Card.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    boardId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'boards',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'cards',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Clé unique de la carte (ex: PROJ-123)',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'To Do',
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(CardPriority)),
      allowNull: false,
      defaultValue: CardPriority.MEDIUM,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    assignee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reporter: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Personne qui a créé/rapporté la tâche',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Catégorie de la tâche',
    },
    labels: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Étiquettes pour catégoriser',
    },
    estimatedTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Temps estimé en heures',
    },
    actualTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Temps réel en heures',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'cards',
    timestamps: true,
    indexes: [
      {
        fields: ['boardId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['priority'],
      },
      {
        fields: ['position'],
      },
    ],
  }
)

export default Card

