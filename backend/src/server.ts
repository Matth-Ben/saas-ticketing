import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { sequelize } from './config/database.js'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

// Charger les variables d'environnement
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Route de santé
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Kanban Time Tracker API is running' })
})

// Middleware de gestion d'erreurs
app.use(errorHandler)

// Connexion à la base de données et démarrage du serveur
async function startServer() {
  try {
    // Test de la connexion à la base de données
    await sequelize.authenticate()
    console.log('✅ Connexion à la base de données établie avec succès.')

    // Synchronisation des modèles (en développement uniquement)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('✅ Modèles synchronisés avec la base de données.')
    }

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`)
      console.log(`📍 API disponible sur http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error)
    process.exit(1)
  }
}

startServer()

export default app

