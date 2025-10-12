import { sequelize } from '../config/database.js'
import Board from './Board.js'
import Card from './Card.js'
import Comment from './Comment.js'
import History from './History.js'
import TimeEntry from './TimeEntry.js'

// Relations entre les modèles
Board.hasMany(Card, {
  foreignKey: 'boardId',
  as: 'cards',
  onDelete: 'CASCADE',
})

Card.belongsTo(Board, {
  foreignKey: 'boardId',
  as: 'board',
})

// Relations parent-enfant pour les sous-tâches
Card.hasMany(Card, {
  foreignKey: 'parentId',
  as: 'subtasks',
  onDelete: 'CASCADE',
})

Card.belongsTo(Card, {
  foreignKey: 'parentId',
  as: 'parent',
})

// Relations pour les commentaires
Card.hasMany(Comment, {
  foreignKey: 'cardId',
  as: 'comments',
  onDelete: 'CASCADE',
})

Comment.belongsTo(Card, {
  foreignKey: 'cardId',
  as: 'card',
})

// Relations pour l'historique
Card.hasMany(History, {
  foreignKey: 'cardId',
  as: 'history',
  onDelete: 'CASCADE',
})

History.belongsTo(Card, {
  foreignKey: 'cardId',
  as: 'card',
})

// Relations pour les entrées de temps
Card.hasMany(TimeEntry, {
  foreignKey: 'cardId',
  as: 'timeEntries',
  onDelete: 'CASCADE',
})

TimeEntry.belongsTo(Card, {
  foreignKey: 'cardId',
  as: 'card',
})

export { sequelize, Board, Card, Comment, History, TimeEntry }

export default {
  sequelize,
  Board,
  Card,
  Comment,
  History,
  TimeEntry,
}
