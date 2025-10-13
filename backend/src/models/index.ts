import { sequelize } from '../config/database.js'
import Board from './Board.js'
import Card from './Card.js'
import Comment from './Comment.js'
import History from './History.js'
import TimeEntry from './TimeEntry.js'
import Quote from './Quote.js'
import QuoteLine from './QuoteLine.js'
import CompanySettings from './CompanySettings.js'

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

// Relations pour les devis
Board.hasMany(Quote, {
  foreignKey: 'boardId',
  as: 'quotes',
  onDelete: 'CASCADE',
})

Quote.belongsTo(Board, {
  foreignKey: 'boardId',
  as: 'board',
})

Quote.hasMany(QuoteLine, {
  foreignKey: 'quoteId',
  as: 'lines',
  onDelete: 'CASCADE',
})

QuoteLine.belongsTo(Quote, {
  foreignKey: 'quoteId',
  as: 'quote',
})

// Relation optionnelle entre QuoteLine et Card
QuoteLine.belongsTo(Card, {
  foreignKey: 'cardId',
  as: 'card',
})

Card.hasMany(QuoteLine, {
  foreignKey: 'cardId',
  as: 'quoteLines',
  onDelete: 'SET NULL',
})

export { sequelize, Board, Card, Comment, History, TimeEntry, Quote, QuoteLine, CompanySettings }

export default {
  sequelize,
  Board,
  Card,
  Comment,
  History,
  TimeEntry,
  Quote,
  QuoteLine,
  CompanySettings,
}
