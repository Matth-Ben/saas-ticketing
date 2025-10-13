import { Router } from 'express'
import {
  getCompanySettings,
  updateCompanySettings,
  resetCompanySettings,
} from '../controllers/companySettingsController.js'

const router = Router()

// Routes pour les paramètres d'entreprise
router.get('/', getCompanySettings)
router.put('/', updateCompanySettings)
router.post('/reset', resetCompanySettings)

export default router
