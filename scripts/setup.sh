#!/bin/bash

# Script de setup initial du projet SaaS Ticketing

set -e

echo "🚀 Configuration du projet SaaS Ticketing..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env à partir de .env.example..."
    cp .env.example .env
    echo "⚠️  Veuillez configurer les variables d'environnement dans .env"
else
    echo "✅ Le fichier .env existe déjà"
fi

# Installer les dépendances backend
echo "📦 Installation des dépendances backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dépendances backend déjà installées"
fi
cd ..

# Installer les dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dépendances frontend déjà installées"
fi
cd ..

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
cd backend
npx prisma generate
cd ..

echo "✅ Setup terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans .env"
echo "2. Lancez les services avec : docker-compose up --build"
echo "3. Exécutez les migrations avec : docker-compose exec backend npm run prisma:migrate"
echo "4. Seed la base de données avec : docker-compose exec backend npm run prisma:seed"

