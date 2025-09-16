@echo off
echo ========================================
echo   360FLOW - DEPLOIEMENT VERCEL
echo ========================================
echo.

echo [1/6] Installation de la CLI Vercel...
npm install -g vercel
if %errorlevel% neq 0 (
    echo ERREUR: Impossible d'installer la CLI Vercel
    echo Veuillez installer Node.js d'abord
    pause
    exit /b 1
)

echo.
echo [2/6] Connexion a Vercel...
vercel login
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de se connecter a Vercel
    pause
    exit /b 1
)

echo.
echo [3/6] Deploiement du backend...
cd apps\backend
vercel --prod
if %errorlevel% neq 0 (
    echo ERREUR: Deploiement backend echoue
    pause
    exit /b 1
)

echo.
echo [4/6] Retour au dossier racine...
cd ..\..

echo.
echo [5/6] Deploiement du frontend...
cd apps\frontend
vercel --prod
if %errorlevel% neq 0 (
    echo ERREUR: Deploiement frontend echoue
    pause
    exit /b 1
)

echo.
echo [6/6] Retour au dossier racine...
cd ..\..

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE AVEC SUCCES!
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Configurez les variables d'environnement dans Vercel
echo 2. Creez une base de donnees Vercel Postgres
echo 3. Testez votre application
echo.
pause
