import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'
import Board from './Board.js'

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  INVOICED = 'invoiced',
}

export enum QuoteLineType {
  TASK = 'task',
  MATERIAL = 'material',
  SERVICE = 'service',
  DISCOUNT = 'discount',
}

interface QuoteAttributes {
  id: string
  boardId: string
  quoteNumber: string
  title: string
  description?: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  status: QuoteStatus
  validUntil?: Date
  totalAmount: number
  totalHours: number
  hourlyRate: number
  margin: number // Pourcentage de marge
  createdAt?: Date
  updatedAt?: Date
}

interface QuoteCreationAttributes extends Optional<QuoteAttributes, 'id' | 'description' | 'clientEmail' | 'clientAddress' | 'validUntil' | 'margin'> {}

class Quote extends Model<QuoteAttributes, QuoteCreationAttributes> implements QuoteAttributes {
  declare id: string
  declare boardId: string
  declare quoteNumber: string
  declare title: string
  declare description?: string
  declare clientName: string
  declare clientEmail?: string
  declare clientAddress?: string
  declare status: QuoteStatus
  declare validUntil?: Date
  declare totalAmount: number
  declare totalHours: number
  declare hourlyRate: number
  declare margin: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Quote.init(
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
      comment: 'ID du projet associé',
    },
    quoteNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Numéro de devis unique (ex: DEV-2025-001)',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200],
      },
      comment: 'Titre du devis',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description détaillée du devis',
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
      comment: 'Nom du client',
    },
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: 'Email du client',
    },
    clientAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Adresse du client',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(QuoteStatus)),
      allowNull: false,
      defaultValue: QuoteStatus.DRAFT,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de validité du devis',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Montant total du devis (HT)',
    },
    totalHours: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Nombre total d\'heures estimées',
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Taux horaire (€/h)',
    },
    margin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 20,
      comment: 'Marge en pourcentage',
    },
  },
  {
    sequelize,
    tableName: 'quotes',
    timestamps: true,
  }
)

export default Quote
