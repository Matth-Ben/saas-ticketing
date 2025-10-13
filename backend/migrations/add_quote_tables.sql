-- Migration pour ajouter les tables de devis
-- Date: 2025-10-12
-- Description: Ajout des tables quotes et quote_lines pour le module de devis

-- Table des devis
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'invoiced')),
    valid_until TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_hours DECIMAL(8,2) NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(8,2) NOT NULL DEFAULT 0,
    margin DECIMAL(5,2) NOT NULL DEFAULT 20,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des lignes de devis
CREATE TABLE IF NOT EXISTS quote_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    line_number INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('task', 'material', 'service', 'discount')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    quantity DECIMAL(8,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    estimated_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2),
    category VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_quotes_board_id ON quotes(board_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_lines_quote_id ON quote_lines(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_lines_card_id ON quote_lines(card_id);
CREATE INDEX IF NOT EXISTS idx_quote_lines_line_number ON quote_lines(quote_id, line_number);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les tables quotes et quote_lines
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quote_lines_updated_at ON quote_lines;
CREATE TRIGGER update_quote_lines_updated_at
    BEFORE UPDATE ON quote_lines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE quotes IS 'Table des devis associés aux projets';
COMMENT ON TABLE quote_lines IS 'Table des lignes de détail des devis';

COMMENT ON COLUMN quotes.board_id IS 'ID du projet associé';
COMMENT ON COLUMN quotes.quote_number IS 'Numéro unique du devis (ex: DEV-2025-001)';
COMMENT ON COLUMN quotes.status IS 'Statut du devis: draft, sent, accepted, rejected, invoiced';
COMMENT ON COLUMN quotes.total_amount IS 'Montant total du devis en euros HT';
COMMENT ON COLUMN quotes.total_hours IS 'Nombre total d''heures estimées';
COMMENT ON COLUMN quotes.hourly_rate IS 'Taux horaire en euros';
COMMENT ON COLUMN quotes.margin IS 'Marge en pourcentage';

COMMENT ON COLUMN quote_lines.quote_id IS 'ID du devis parent';
COMMENT ON COLUMN quote_lines.card_id IS 'ID de la tâche associée (optionnel)';
COMMENT ON COLUMN quote_lines.line_number IS 'Numéro de ligne dans le devis';
COMMENT ON COLUMN quote_lines.type IS 'Type de ligne: task, material, service, discount';
COMMENT ON COLUMN quote_lines.quantity IS 'Quantité';
COMMENT ON COLUMN quote_lines.unit_price IS 'Prix unitaire en euros';
COMMENT ON COLUMN quote_lines.total_price IS 'Prix total (quantité × prix unitaire)';
COMMENT ON COLUMN quote_lines.estimated_hours IS 'Heures estimées pour cette ligne';
COMMENT ON COLUMN quote_lines.actual_hours IS 'Heures réelles passées';

-- Données d'exemple (optionnel)
-- INSERT INTO quotes (board_id, quote_number, title, client_name, total_amount, total_hours, hourly_rate, margin)
-- SELECT 
--     id,
--     'DEV-2025-001',
--     'Devis exemple pour ' || name,
--     'Client exemple',
--     1000.00,
--     20.0,
--     50.00,
--     20.0
-- FROM boards
-- WHERE NOT EXISTS (SELECT 1 FROM quotes WHERE board_id = boards.id)
-- LIMIT 1;
