import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface HistoryAttributes {
  id: string
  cardId: string
  user: string
  action: string
  field?: string
  oldValue?: string
  newValue?: string
  createdAt?: Date
}

interface HistoryCreationAttributes extends Optional<HistoryAttributes, 'id' | 'field' | 'oldValue' | 'newValue'> {}

class History extends Model<HistoryAttributes, HistoryCreationAttributes> implements HistoryAttributes {
  declare id: string
  declare cardId: string
  declare user: string
  declare action: string
  declare field?: string
  declare oldValue?: string
  declare newValue?: string
  declare readonly createdAt: Date
}

History.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Utilisateur ayant effectué l\'action',
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type d\'action (created, updated, moved, etc.)',
    },
    field: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Champ modifié',
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ancienne valeur',
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nouvelle valeur',
    },
  },
  {
    sequelize,
    tableName: 'histories',
    timestamps: true,
    updatedAt: false,
  }
)

export default History

