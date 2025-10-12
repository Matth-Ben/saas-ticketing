import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface CommentAttributes {
  id: string
  cardId: string
  author: string
  content: string
  createdAt?: Date
  updatedAt?: Date
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  declare id: string
  declare cardId: string
  declare author: string
  declare content: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

Comment.init(
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
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
  }
)

export default Comment

