#!/bin/bash

# Script pour seed la base de données

set -e

echo "🌱 Seed de la base de données..."

# Vérifier que le backend est en cours d'exécution
if ! docker-compose ps backend | grep -q "Up"; then
    echo "❌ Le service backend n'est pas en cours d'exécution."
    echo "   Lancez d'abord : docker-compose up -d"
    exit 1
fi

# Exécuter le seed
docker-compose exec backend npm run prisma:seed

echo "✅ Seed terminé !"

