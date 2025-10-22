-- Migration: Ajouter la colonne quoteId à la table cards
-- Date: 2025-10-22
-- Description: Permet de lier une tâche (card) au devis dont elle provient

-- Ajouter la colonne quoteId
ALTER TABLE cards
ADD COLUMN "quoteId" UUID NULL;

-- Ajouter la contrainte de clé étrangère
ALTER TABLE cards
ADD CONSTRAINT fk_cards_quote
FOREIGN KEY ("quoteId") REFERENCES quotes(id)
ON DELETE SET NULL;

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN cards."quoteId" IS 'Référence au devis dont provient cette tâche';

-- Créer un index pour améliorer les performances
CREATE INDEX idx_cards_quote_id ON cards("quoteId");

