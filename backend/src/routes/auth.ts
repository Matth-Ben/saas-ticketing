import { Router } from 'express'

const router = Router()

// Routes d'authentification (à implémenter dans Sprint 5)
router.post('/register', (_req, res) => {
  res.json({ message: 'Route register - À implémenter' })
})

router.post('/login', (_req, res) => {
  res.json({ message: 'Route login - À implémenter' })
})

router.get('/me', (_req, res) => {
  res.json({ message: 'Route me - À implémenter' })
})

export default router

