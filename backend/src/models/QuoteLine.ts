import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'
import Quote from './Quote.js'
import Card from './Card.js'

export enum QuoteLineType {
  TASK = 'task',
  MATERIAL = 'material',
  SERVICE = 'service',
  DISCOUNT = 'discount',
}

interface QuoteLineAttributes {
  id: string
  quoteId: string
  cardId?: string // Optionnel, pour les lignes liées à une tâche
  lineNumber: number
  type: QuoteLineType
  title: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  estimatedHours?: number
  actualHours?: number
  category?: string
  createdAt?: Date
  updatedAt?: Date
}

interface QuoteLineCreationAttributes extends Optional<QuoteLineAttributes, 'id' | 'cardId' | 'description' | 'estimatedHours' | 'actualHours' | 'category'> {}

class QuoteLine extends Model<QuoteLineAttributes, QuoteLineCreationAttributes> implements QuoteLineAttributes {
  declare id: string
  declare quoteId: string
  declare cardId?: string
  declare lineNumber: number
  declare type: QuoteLineType
  declare title: string
  declare description?: string
  declare quantity: number
  declare unitPrice: number
  declare totalPrice: number
  declare estimatedHours?: number
  declare actualHours?: number
  declare category?: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

QuoteLine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quoteId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'quotes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'ID du devis parent',
    },
    cardId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'cards',
        key: 'id',
      },
      onDelete: 'SET NULL',
      comment: 'ID de la tâche associée (optionnel)',
    },
    lineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Numéro de ligne dans le devis',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(QuoteLineType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200],
      },
      comment: 'Titre de la ligne',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description détaillée',
    },
    quantity: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 1,
      comment: 'Quantité',
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Prix unitaire (€)',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Prix total (quantité × prix unitaire)',
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Heures estimées pour cette ligne',
    },
    actualHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Heures réelles passées',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Catégorie de la ligne',
    },
  },
  {
    sequelize,
    tableName: 'quote_lines',
    timestamps: true,
  }
)

export default QuoteLine
