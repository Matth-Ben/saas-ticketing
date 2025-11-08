#!/bin/bash

# Script pour réinitialiser la base de données

set -e

echo "⚠️  ATTENTION : Cette action va supprimer toutes les données de la base de données !"
read -p "Êtes-vous sûr de vouloir continuer ? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Opération annulée"
    exit 0
fi

echo "🗑️  Réinitialisation de la base de données..."

# Arrêter les services
docker-compose down

# Supprimer le volume de la base de données
docker volume rm saas-ticketing_postgres_data 2>/dev/null || echo "Volume déjà supprimé"

# Relancer les services
docker-compose up -d db

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Exécuter les migrations
docker-compose exec -T db psql -U saas_user -d saas_ticketing -c "SELECT 1" > /dev/null 2>&1 || sleep 5

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
docker-compose exec backend npm run prisma:migrate

# Seed la base de données
echo "🌱 Seed de la base de données..."
docker-compose exec backend npm run prisma:seed

echo "✅ Base de données réinitialisée !"

