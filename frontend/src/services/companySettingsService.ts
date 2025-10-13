import api from './api'

export interface CompanySettings {
  id: string
  name: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  siret?: string
  vatNumber?: string
  logo?: string
  defaultHourlyRate: number
  defaultMargin: number
  currency: string
  language: string
  createdAt: string
  updatedAt: string
}

class CompanySettingsService {
  /**
   * Récupérer les paramètres de l'entreprise
   */
  async get(): Promise<CompanySettings> {
    const response = await api.get('/company-settings')
    return response.data
  }

  /**
   * Mettre à jour les paramètres de l'entreprise
   */
  async update(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const response = await api.put('/company-settings', settings)
    return response.data
  }

  /**
   * Réinitialiser les paramètres par défaut
   */
  async reset(): Promise<CompanySettings> {
    const response = await api.post('/company-settings/reset')
    return response.data
  }

  /**
   * Valider les paramètres de l'entreprise
   */
  validateSettings(settings: Partial<CompanySettings>): string[] {
    const errors: string[] = []

    if (!settings.name?.trim()) {
      errors.push('Le nom de l\'entreprise est obligatoire')
    }

    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      errors.push('L\'email n\'est pas valide')
    }

    if (settings.website && !/^https?:\/\/.+/.test(settings.website)) {
      errors.push('L\'URL du site web doit commencer par http:// ou https://')
    }

    if (settings.defaultHourlyRate !== undefined && settings.defaultHourlyRate < 0) {
      errors.push('Le taux horaire par défaut doit être positif')
    }

    if (settings.defaultMargin !== undefined && (settings.defaultMargin < 0 || settings.defaultMargin > 100)) {
      errors.push('La marge par défaut doit être entre 0 et 100%')
    }

    return errors
  }

  /**
   * Formater l'adresse complète
   */
  formatFullAddress(settings: CompanySettings): string {
    const parts = [
      settings.address,
      settings.postalCode && settings.city ? `${settings.postalCode} ${settings.city}` : settings.city,
      settings.country,
    ].filter(Boolean)

    return parts.join(', ')
  }

  /**
   * Obtenir les informations de contact formatées
   */
  getContactInfo(settings: CompanySettings): { label: string; value: string; icon: string }[] {
    const contacts = []

    if (settings.phone) {
      contacts.push({
        label: 'Téléphone',
        value: settings.phone,
        icon: '📞',
      })
    }

    if (settings.email) {
      contacts.push({
        label: 'Email',
        value: settings.email,
        icon: '📧',
      })
    }

    if (settings.website) {
      contacts.push({
        label: 'Site web',
        value: settings.website,
        icon: '🌐',
      })
    }

    return contacts
  }

  /**
   * Obtenir les informations légales formatées
   */
  getLegalInfo(settings: CompanySettings): { label: string; value: string; icon: string }[] {
    const legal = []

    if (settings.siret) {
      legal.push({
        label: 'SIRET',
        value: settings.siret,
        icon: '🏢',
      })
    }

    if (settings.vatNumber) {
      legal.push({
        label: 'TVA',
        value: settings.vatNumber,
        icon: '📋',
      })
    }

    return legal
  }
}

export const companySettingsService = new CompanySettingsService()
export default companySettingsService
