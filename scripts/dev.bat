@echo off
REM Script de développement pour SaaS Ticketing (Windows)
REM Usage: scripts\dev.bat [command]

setlocal enabledelayedexpansion

cd /d "%~dp0\.."

if "%1"=="" goto :help

if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="restart" goto :restart
if "%1"=="rebuild" goto :rebuild
if "%1"=="logs" goto :logs
if "%1"=="logs-backend" goto :logs-backend
if "%1"=="logs-frontend" goto :logs-frontend
if "%1"=="logs-db" goto :logs-db
if "%1"=="status" goto :status
if "%1"=="shell-backend" goto :shell-backend
if "%1"=="shell-frontend" goto :shell-frontend
if "%1"=="prisma:studio" goto :prisma-studio
if "%1"=="prisma:migrate" goto :prisma-migrate
if "%1"=="prisma:seed" goto :prisma-seed
if "%1"=="prisma:reset" goto :prisma-reset
if "%1"=="clean" goto :clean
if "%1"=="init" goto :init
goto :help

:help
echo ===================================
echo 🎫 SaaS Ticketing - Dev Helper
echo ===================================
echo.
echo Usage: scripts\dev.bat [command]
echo.
echo Commands:
echo   start          - Démarrer tous les services
echo   stop           - Arrêter tous les services
echo   restart        - Redémarrer tous les services
echo   rebuild        - Rebuild et redémarrer
echo   logs           - Voir les logs (tous les services)
echo   logs-backend   - Voir les logs du backend
echo   logs-frontend  - Voir les logs du frontend
echo   logs-db        - Voir les logs de la DB
echo   status         - Statut des services
echo   shell-backend  - Ouvrir un shell dans le backend
echo   shell-frontend - Ouvrir un shell dans le frontend
echo   prisma:studio  - Ouvrir Prisma Studio
echo   prisma:migrate - Exécuter les migrations
echo   prisma:seed    - Seed la base de données
echo   prisma:reset   - Reset la DB (⚠️ destructif)
echo   clean          - Nettoyer tout (⚠️ très destructif)
echo   init           - Initialiser le projet
echo.
goto :eof

:start
echo 🚀 Démarrage des services...
docker-compose up -d
echo ✅ Services démarrés
echo.
echo Accès :
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:4000
echo   Health   : http://localhost:4000/health
goto :eof

:stop
echo ⏸️  Arrêt des services...
docker-compose down
echo ✅ Services arrêtés
goto :eof

:restart
echo 🔄 Redémarrage des services...
docker-compose restart
echo ✅ Services redémarrés
goto :eof

:rebuild
echo 🔨 Rebuild des images...
docker-compose down
docker-compose up --build -d
echo ✅ Services rebuild et redémarrés
goto :eof

:logs
docker-compose logs -f
goto :eof

:logs-backend
docker-compose logs -f backend
goto :eof

:logs-frontend
docker-compose logs -f frontend
goto :eof

:logs-db
docker-compose logs -f db
goto :eof

:status
echo 📊 Statut des services :
echo.
docker-compose ps
goto :eof

:shell-backend
echo 🐚 Shell backend
docker-compose exec backend sh
goto :eof

:shell-frontend
echo 🐚 Shell frontend
docker-compose exec frontend sh
goto :eof

:prisma-studio
echo 🎨 Ouverture de Prisma Studio...
echo Accès : http://localhost:5555
docker-compose exec backend npm run prisma:studio
goto :eof

:prisma-migrate
echo 🔄 Exécution des migrations Prisma...
docker-compose exec backend npm run prisma:migrate
echo ✅ Migrations exécutées
goto :eof

:prisma-seed
echo 🌱 Seed de la base de données...
docker-compose exec backend npm run prisma:seed
echo ✅ Base de données peuplée
goto :eof

:prisma-reset
echo ⚠️  Reset de la base de données (destructif!)
set /p confirm="Êtes-vous sûr ? (y/N) "
if /i "%confirm%"=="y" (
    docker-compose exec backend npx prisma migrate reset --force
    echo ✅ Base de données réinitialisée
) else (
    echo ❌ Annulé
)
goto :eof

:clean
echo ⚠️  Nettoyage complet (très destructif!)
echo Cela va supprimer :
echo   - Tous les conteneurs
echo   - Tous les volumes (base de données incluse)
echo   - Toutes les images
echo.
set /p confirm="Êtes-vous VRAIMENT sûr ? (y/N) "
if /i "%confirm%"=="y" (
    docker-compose down -v
    docker system prune -af
    echo ✅ Nettoyage terminé
) else (
    echo ❌ Annulé
)
goto :eof

:init
echo 🎬 Initialisation du projet...
echo.

REM Vérifier .env
if not exist .env (
    echo ⚠️  Fichier .env manquant, copie depuis .env.example
    copy .env.example .env
)

REM Démarrer les services
echo 1. Démarrage des services...
docker-compose up -d

REM Attendre que la DB soit prête
echo 2. Attente de la base de données...
timeout /t 10 /nobreak >nul

REM Migrations
echo 3. Exécution des migrations...
docker-compose exec backend npm run prisma:migrate

REM Seed
echo 4. Seed de la base de données...
docker-compose exec backend npm run prisma:seed

echo.
echo ✅ Initialisation terminée !
echo.
echo Accès :
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:4000
echo   Health   : http://localhost:4000/health
goto :eof
