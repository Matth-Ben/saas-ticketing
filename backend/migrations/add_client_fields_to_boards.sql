-- Migration pour ajouter les champs client aux projets
-- Date: 2025-10-12
-- Description: Ajout des champs clientName, clientEmail, clientAddress, clientPhone à la table boards

-- Ajouter les colonnes client à la table boards
ALTER TABLE boards 
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_address TEXT,
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(50);

-- Ajouter les commentaires
COMMENT ON COLUMN boards.client_name IS 'Nom du client associé au projet';
COMMENT ON COLUMN boards.client_email IS 'Email du client';
COMMENT ON COLUMN boards.client_address IS 'Adresse du client';
COMMENT ON COLUMN boards.client_phone IS 'Téléphone du client';

-- Ajouter une contrainte de validation pour l'email si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'boards_client_email_check' 
        AND table_name = 'boards'
    ) THEN
        ALTER TABLE boards 
        ADD CONSTRAINT boards_client_email_check 
        CHECK (client_email IS NULL OR client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

-- Mettre à jour les projets existants pour utiliser le nom du projet comme nom de client
UPDATE boards 
SET client_name = name 
WHERE client_name IS NULL;

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'boards' 
AND column_name IN ('client_name', 'client_email', 'client_address', 'client_phone')
ORDER BY column_name;
