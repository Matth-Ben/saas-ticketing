-- Script de nettoyage pour supprimer les tables de devis problématiques
-- À exécuter si Sequelize a des problèmes de synchronisation

-- Supprimer les tables dans le bon ordre (dépendances)
DROP TABLE IF EXISTS quote_lines CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;

-- Vérifier que les tables ont été supprimées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quotes', 'quote_lines');
