import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface ColumnColors {
  [key: string]: string
}

interface BoardAttributes {
  id: string
  name: string
  description?: string
  color?: string
  columns: string[]
  columnColors: ColumnColors
  clientName?: string
  clientEmail?: string
  clientAddress?: string
  clientPhone?: string
  createdAt?: Date
  updatedAt?: Date
}

interface BoardCreationAttributes extends Optional<BoardAttributes, 'id' | 'description' | 'color' | 'columnColors' | 'clientName' | 'clientEmail' | 'clientAddress' | 'clientPhone'> {}

class Board extends Model<BoardAttributes, BoardCreationAttributes> implements BoardAttributes {
  declare id: string
  declare name: string
  declare description?: string
  declare color?: string
  declare columns: string[]
  declare columnColors: ColumnColors
  declare clientName?: string
  declare clientEmail?: string
  declare clientAddress?: string
  declare clientPhone?: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Board.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#a8ff99',
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/,
      },
    },
    columns: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ['To Do', 'In Progress', 'Done'],
    },
    columnColors: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        'To Do': '#93c5fd',      // Bleu clair
        'In Progress': '#fbbf24', // Jaune/Orange
        'Done': '#a8ff99',        // Vert (notre couleur secondaire)
      },
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nom du client associé au projet',
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
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Téléphone du client',
    },
  },
  {
    sequelize,
    tableName: 'boards',
    timestamps: true,
  }
)

export default Board

