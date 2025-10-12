-- Migration pour ajouter la colonne 'key' aux cartes existantes
-- Date: 12 octobre 2025

-- Étape 1: Ajouter la colonne key comme nullable temporairement
ALTER TABLE cards ADD COLUMN IF NOT EXISTS key VARCHAR(255);

-- Étape 2: Générer des clés pour les cartes existantes
DO $$
DECLARE
    card_record RECORD;
    board_record RECORD;
    board_prefix VARCHAR(4);
    card_counter INTEGER;
BEGIN
    -- Pour chaque board
    FOR board_record IN SELECT id, name FROM boards
    LOOP
        -- Générer le préfixe du board
        board_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(board_record.name, '[^A-Z]', '', 'gi'), 1, 4));
        IF LENGTH(board_prefix) < 4 THEN
            board_prefix := RPAD(board_prefix, 4, 'X');
        END IF;
        
        card_counter := 1;
        
        -- Mettre à jour toutes les cartes de ce board qui n'ont pas de clé
        FOR card_record IN 
            SELECT id FROM cards 
            WHERE "boardId" = board_record.id 
            AND "parentId" IS NULL 
            AND key IS NULL
            ORDER BY "createdAt" ASC
        LOOP
            UPDATE cards 
            SET key = board_prefix || '-' || card_counter 
            WHERE id = card_record.id;
            
            card_counter := card_counter + 1;
        END LOOP;
        
        -- Pour les sous-tâches, générer des clés avec suffix
        FOR card_record IN 
            SELECT id FROM cards 
            WHERE "boardId" = board_record.id 
            AND "parentId" IS NOT NULL 
            AND key IS NULL
            ORDER BY "createdAt" ASC
        LOOP
            UPDATE cards 
            SET key = board_prefix || '-SUB-' || card_counter 
            WHERE id = card_record.id;
            
            card_counter := card_counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Étape 3: Rendre la colonne NOT NULL et unique
ALTER TABLE cards ALTER COLUMN key SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS cards_key_unique ON cards(key);

-- Ajouter les autres colonnes manquantes
ALTER TABLE cards ADD COLUMN IF NOT EXISTS reporter VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

-- Commentaires
COMMENT ON COLUMN cards.key IS 'Clé unique de la carte (ex: PROJ-123)';
COMMENT ON COLUMN cards.reporter IS 'Personne qui a créé/rapporté la tâche';
COMMENT ON COLUMN cards.category IS 'Catégorie de la tâche';
COMMENT ON COLUMN cards.labels IS 'Étiquettes pour catégoriser';

