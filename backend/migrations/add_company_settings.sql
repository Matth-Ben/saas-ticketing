-- Migration pour ajouter la table des paramètres d'entreprise
-- Date: 2025-10-12
-- Description: Ajout de la table company_settings pour stocker les informations de l'entreprise

-- Table des paramètres d'entreprise
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    siret VARCHAR(50),
    vat_number VARCHAR(50),
    logo VARCHAR(500),
    default_hourly_rate DECIMAL(8,2) NOT NULL DEFAULT 50,
    default_margin DECIMAL(5,2) NOT NULL DEFAULT 20,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_company_settings_name ON company_settings(name);

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON company_settings;
CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE company_settings IS 'Table des paramètres de l\'entreprise pour les devis';

COMMENT ON COLUMN company_settings.name IS 'Nom de l\'entreprise';
COMMENT ON COLUMN company_settings.address IS 'Adresse de l\'entreprise';
COMMENT ON COLUMN company_settings.city IS 'Ville';
COMMENT ON COLUMN company_settings.postal_code IS 'Code postal';
COMMENT ON COLUMN company_settings.country IS 'Pays';
COMMENT ON COLUMN company_settings.phone IS 'Téléphone';
COMMENT ON COLUMN company_settings.email IS 'Email de contact';
COMMENT ON COLUMN company_settings.website IS 'Site web';
COMMENT ON COLUMN company_settings.siret IS 'Numéro SIRET';
COMMENT ON COLUMN company_settings.vat_number IS 'Numéro de TVA';
COMMENT ON COLUMN company_settings.logo IS 'URL du logo';
COMMENT ON COLUMN company_settings.default_hourly_rate IS 'Taux horaire par défaut (€/h)';
COMMENT ON COLUMN company_settings.default_margin IS 'Marge par défaut (%)';
COMMENT ON COLUMN company_settings.currency IS 'Devise par défaut';
COMMENT ON COLUMN company_settings.language IS 'Langue par défaut';

-- Données d'exemple (optionnel)
-- INSERT INTO company_settings (name, default_hourly_rate, default_margin, currency, language)
-- VALUES ('Votre Entreprise', 50.00, 20.00, 'EUR', 'fr')
-- ON CONFLICT DO NOTHING;
