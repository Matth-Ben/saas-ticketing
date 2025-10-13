import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database.js'

interface CompanySettingsAttributes {
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
  createdAt?: Date
  updatedAt?: Date
}

interface CompanySettingsCreationAttributes extends Optional<CompanySettingsAttributes, 'id' | 'address' | 'city' | 'postalCode' | 'country' | 'phone' | 'email' | 'website' | 'siret' | 'vatNumber' | 'logo' | 'defaultHourlyRate' | 'defaultMargin' | 'currency' | 'language'> {}

class CompanySettings extends Model<CompanySettingsAttributes, CompanySettingsCreationAttributes> implements CompanySettingsAttributes {
  declare id: string
  declare name: string
  declare address?: string
  declare city?: string
  declare postalCode?: string
  declare country?: string
  declare phone?: string
  declare email?: string
  declare website?: string
  declare siret?: string
  declare vatNumber?: string
  declare logo?: string
  declare defaultHourlyRate: number
  declare defaultMargin: number
  declare currency: string
  declare language: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

CompanySettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200],
      },
      comment: 'Nom de l\'entreprise',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Adresse de l\'entreprise',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ville',
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Code postal',
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Pays',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Téléphone',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: 'Email de contact',
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Site web',
    },
    siret: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Numéro SIRET',
    },
    vatNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Numéro de TVA',
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL du logo',
    },
    defaultHourlyRate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 50,
      comment: 'Taux horaire par défaut (€/h)',
    },
    defaultMargin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 20,
      comment: 'Marge par défaut (%)',
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'EUR',
      comment: 'Devise par défaut',
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'fr',
      comment: 'Langue par défaut',
    },
  },
  {
    sequelize,
    tableName: 'company_settings',
    timestamps: true,
  }
)

export default CompanySettings
