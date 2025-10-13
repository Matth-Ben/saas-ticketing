import { Request, Response } from 'express'
import { CompanySettings } from '../models/index.js'

// Récupérer les paramètres de l'entreprise
export const getCompanySettings = async (req: Request, res: Response) => {
  try {
    // Pour l'instant, on récupère le premier enregistrement
    // Plus tard, on pourra ajouter un système d'utilisateurs
    let settings = await CompanySettings.findOne()

    if (!settings) {
      // Créer des paramètres par défaut s'ils n'existent pas
      settings = await CompanySettings.create({
        name: 'Votre Entreprise',
        defaultHourlyRate: 50,
        defaultMargin: 20,
        currency: 'EUR',
        language: 'fr',
      })
    }

    res.json(settings)
  } catch (error) {
    console.error('Error fetching company settings:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' })
  }
}

// Mettre à jour les paramètres de l'entreprise
export const updateCompanySettings = async (req: Request, res: Response) => {
  try {
    const updateData = req.body

    // Récupérer ou créer les paramètres
    let settings = await CompanySettings.findOne()

    if (!settings) {
      settings = await CompanySettings.create({
        name: updateData.name || 'Votre Entreprise',
        address: updateData.address,
        city: updateData.city,
        postalCode: updateData.postalCode,
        country: updateData.country,
        phone: updateData.phone,
        email: updateData.email,
        website: updateData.website,
        siret: updateData.siret,
        vatNumber: updateData.vatNumber,
        logo: updateData.logo,
        defaultHourlyRate: updateData.defaultHourlyRate || 50,
        defaultMargin: updateData.defaultMargin || 20,
        currency: updateData.currency || 'EUR',
        language: updateData.language || 'fr',
      })
    } else {
      await settings.update(updateData)
    }

    res.json(settings)
  } catch (error) {
    console.error('Error updating company settings:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres' })
  }
}

// Réinitialiser les paramètres par défaut
export const resetCompanySettings = async (req: Request, res: Response) => {
  try {
    await CompanySettings.destroy({ where: {} })

    const defaultSettings = await CompanySettings.create({
      name: 'Votre Entreprise',
      defaultHourlyRate: 50,
      defaultMargin: 20,
      currency: 'EUR',
      language: 'fr',
    })

    res.json(defaultSettings)
  } catch (error) {
    console.error('Error resetting company settings:', error)
    res.status(500).json({ error: 'Erreur lors de la réinitialisation des paramètres' })
  }
}
