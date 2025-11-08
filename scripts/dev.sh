#!/bin/bash

# Script de développement pour SaaS Ticketing
# Usage: ./scripts/dev.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}==================================="
    echo "🎫 SaaS Ticketing - Dev Helper"
    echo -e "===================================${NC}\n"
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start         - Démarrer tous les services"
    echo "  stop          - Arrêter tous les services"
    echo "  restart       - Redémarrer tous les services"
    echo "  rebuild       - Rebuild et redémarrer"
    echo "  logs          - Voir les logs (tous les services)"
    echo "  logs-backend  - Voir les logs du backend"
    echo "  logs-frontend - Voir les logs du frontend"
    echo "  logs-db       - Voir les logs de la DB"
    echo "  status        - Statut des services"
    echo "  shell-backend - Ouvrir un shell dans le backend"
    echo "  shell-frontend- Ouvrir un shell dans le frontend"
    echo "  prisma:studio - Ouvrir Prisma Studio"
    echo "  prisma:migrate- Exécuter les migrations"
    echo "  prisma:seed   - Seed la base de données"
    echo "  prisma:reset  - Reset la DB (⚠️ destructif)"
    echo "  clean         - Nettoyer tout (⚠️ très destructif)"
    echo "  init          - Initialiser le projet"
    echo ""
}

# Commandes
case "$1" in
    start)
        echo -e "${GREEN}🚀 Démarrage des services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Services démarrés${NC}"
        echo -e "\n${BLUE}Accès :${NC}"
        echo "  Frontend : http://localhost:3000"
        echo "  Backend  : http://localhost:4000"
        echo "  Health   : http://localhost:4000/health"
        ;;

    stop)
        echo -e "${YELLOW}⏸️  Arrêt des services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services arrêtés${NC}"
        ;;

    restart)
        echo -e "${YELLOW}🔄 Redémarrage des services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Services redémarrés${NC}"
        ;;

    rebuild)
        echo -e "${YELLOW}🔨 Rebuild des images...${NC}"
        docker-compose down
        docker-compose up --build -d
        echo -e "${GREEN}✅ Services rebuild et redémarrés${NC}"
        ;;

    logs)
        docker-compose logs -f
        ;;

    logs-backend)
        docker-compose logs -f backend
        ;;

    logs-frontend)
        docker-compose logs -f frontend
        ;;

    logs-db)
        docker-compose logs -f db
        ;;

    status)
        echo -e "${BLUE}📊 Statut des services :${NC}\n"
        docker-compose ps
        ;;

    shell-backend)
        echo -e "${BLUE}🐚 Shell backend${NC}"
        docker-compose exec backend sh
        ;;

    shell-frontend)
        echo -e "${BLUE}🐚 Shell frontend${NC}"
        docker-compose exec frontend sh
        ;;

    prisma:studio)
        echo -e "${BLUE}🎨 Ouverture de Prisma Studio...${NC}"
        echo "Accès : http://localhost:5555"
        docker-compose exec backend npm run prisma:studio
        ;;

    prisma:migrate)
        echo -e "${YELLOW}🔄 Exécution des migrations Prisma...${NC}"
        docker-compose exec backend npm run prisma:migrate
        echo -e "${GREEN}✅ Migrations exécutées${NC}"
        ;;

    prisma:seed)
        echo -e "${YELLOW}🌱 Seed de la base de données...${NC}"
        docker-compose exec backend npm run prisma:seed
        echo -e "${GREEN}✅ Base de données peuplée${NC}"
        ;;

    prisma:reset)
        echo -e "${RED}⚠️  Reset de la base de données (destructif!)${NC}"
        read -p "Êtes-vous sûr ? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose exec backend npx prisma migrate reset --force
            echo -e "${GREEN}✅ Base de données réinitialisée${NC}"
        else
            echo -e "${YELLOW}❌ Annulé${NC}"
        fi
        ;;

    clean)
        echo -e "${RED}⚠️  Nettoyage complet (très destructif!)${NC}"
        echo "Cela va supprimer :"
        echo "  - Tous les conteneurs"
        echo "  - Tous les volumes (base de données incluse)"
        echo "  - Toutes les images"
        echo ""
        read -p "Êtes-vous VRAIMENT sûr ? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker system prune -af
            echo -e "${GREEN}✅ Nettoyage terminé${NC}"
        else
            echo -e "${YELLOW}❌ Annulé${NC}"
        fi
        ;;

    init)
        echo -e "${BLUE}🎬 Initialisation du projet...${NC}\n"

        # Vérifier .env
        if [ ! -f .env ]; then
            echo -e "${YELLOW}⚠️  Fichier .env manquant, copie depuis .env.example${NC}"
            cp .env.example .env
        fi

        # Démarrer les services
        echo -e "${GREEN}1. Démarrage des services...${NC}"
        docker-compose up -d

        # Attendre que la DB soit prête
        echo -e "${YELLOW}2. Attente de la base de données...${NC}"
        sleep 10

        # Migrations
        echo -e "${GREEN}3. Exécution des migrations...${NC}"
        docker-compose exec backend npm run prisma:migrate

        # Seed
        echo -e "${GREEN}4. Seed de la base de données...${NC}"
        docker-compose exec backend npm run prisma:seed

        echo -e "\n${GREEN}✅ Initialisation terminée !${NC}"
        echo -e "\n${BLUE}Accès :${NC}"
        echo "  Frontend : http://localhost:3000"
        echo "  Backend  : http://localhost:4000"
        echo "  Health   : http://localhost:4000/health"
        ;;

    *)
        show_help
        ;;
esac
