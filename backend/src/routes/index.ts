import { Router } from 'express'
import boardRoutes from './boards.js'
import cardRoutes from './cards.js'
import subtaskRoutes from './subtasks.js'
import commentRoutes from './comments.js'
import historyRoutes from './history.js'
import authRoutes from './auth.js'
import timeRoutes from './time.js'
import quoteRoutes from './quote.js'
import companySettingsRoutes from './companySettings.js'

const router = Router()

// Routes principales
router.use('/auth', authRoutes)
router.use('/boards', boardRoutes)
router.use('/cards', cardRoutes)
router.use('/subtasks', subtaskRoutes)
router.use('/comments', commentRoutes)
router.use('/history', historyRoutes)
router.use('/time', timeRoutes)
router.use('/quote', quoteRoutes)
router.use('/company-settings', companySettingsRoutes)

// Route de test
router.get('/test', (_req, res) => {
  res.json({ message: 'API fonctionne correctement !' })
})

export default router

