#!/bin/bash

# Script pour créer un utilisateur test

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./scripts/create-user.sh <email> <password> [role]"
    echo "Exemple: ./scripts/create-user.sh test@example.com password123 freelance"
    exit 1
fi

EMAIL=$1
PASSWORD=$2
ROLE=${3:-freelance}

echo "👤 Création de l'utilisateur : $EMAIL"

# Vérifier que le backend est en cours d'exécution
if ! docker-compose ps backend | grep -q "Up"; then
    echo "❌ Le service backend n'est pas en cours d'exécution."
    echo "   Lancez d'abord : docker-compose up -d"
    exit 1
fi

# TODO: Créer un script Node.js pour créer l'utilisateur
# Pour l'instant, utilisez Prisma Studio ou l'API
echo "⚠️  TODO: Implémenter la création d'utilisateur via script"
echo "   Pour l'instant, utilisez Prisma Studio : docker-compose exec backend npm run prisma:studio"

