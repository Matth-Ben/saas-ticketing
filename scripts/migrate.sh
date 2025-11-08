#!/bin/bash

# Script pour exécuter les migrations Prisma

set -e

echo "🔄 Exécution des migrations Prisma..."

# Vérifier que le backend est en cours d'exécution
if ! docker-compose ps backend | grep -q "Up"; then
    echo "❌ Le service backend n'est pas en cours d'exécution."
    echo "   Lancez d'abord : docker-compose up -d"
    exit 1
fi

# Exécuter les migrations
docker-compose exec backend npm run prisma:migrate

echo "✅ Migrations terminées !"

