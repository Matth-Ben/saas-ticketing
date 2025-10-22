-- Script de vérification des relations Quote/Card
-- Date: 2025-10-22
-- Usage: psql -U postgres -d saas_ticketing -f backend/scripts/check-quote-relations.sql

\echo '🔍 Vérification de la colonne quoteId dans la table cards'
\echo '============================================================'

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cards' AND column_name = 'quoteId';

\echo ''
\echo '🔍 Vérification de la contrainte de clé étrangère'
\echo '=================================================='

SELECT 
    constraint_name, 
    constraint_type,
    table_name
FROM information_schema.table_constraints
WHERE table_name = 'cards' AND constraint_name = 'fk_cards_quote';

\echo ''
\echo '🔍 Vérification de l''index sur quoteId'
\echo '========================================'

SELECT 
    indexname, 
    indexdef
FROM pg_indexes
WHERE tablename = 'cards' AND indexname = 'idx_cards_quote_id';

\echo ''
\echo '📊 Statistiques des devis'
\echo '========================='

SELECT 
    status,
    COUNT(*) as nombre
FROM quotes
GROUP BY status
ORDER BY status;

\echo ''
\echo '📊 Statistiques des lignes de devis par type'
\echo '============================================='

SELECT 
    type,
    COUNT(*) as nombre
FROM quote_lines
GROUP BY type
ORDER BY type;

\echo ''
\echo '🎫 Tickets liés à des devis'
\echo '============================'

SELECT 
    COUNT(*) as total_tickets_avec_devis
FROM cards
WHERE "quoteId" IS NOT NULL;

\echo ''
\echo '📋 Derniers tickets générés depuis un devis'
\echo '============================================'

SELECT 
    c.key,
    c.title,
    c.status,
    q."quoteNumber",
    c."createdAt"
FROM cards c
INNER JOIN quotes q ON c."quoteId" = q.id
ORDER BY c."createdAt" DESC
LIMIT 10;

\echo ''
\echo '✅ Vérification terminée !'
\echo ''

