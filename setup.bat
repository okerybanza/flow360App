@echo off
echo ========================================
echo   360FLOW - INSTALLATION AUTOMATIQUE
echo ========================================
echo.

echo [1/6] Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe. Installation en cours...
    winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
    echo Veuillez redemarrer votre terminal apres l'installation.
    pause
    exit /b 1
) else (
    echo Node.js est deja installe.
)

echo.
echo [2/6] Creation des fichiers d'environnement...

echo # Database Configuration > apps\backend\.env
echo DATABASE_URL="postgresql://postgres:password@localhost:5432/360flow?schema=public" >> apps\backend\.env
echo. >> apps\backend\.env
echo # JWT Secrets >> apps\backend\.env
echo JWT_SECRET="360flow-super-secret-jwt-key-development-2024" >> apps\backend\.env
echo JWT_REFRESH_SECRET="360flow-super-secret-refresh-key-development-2024" >> apps\backend\.env
echo. >> apps\backend\.env
echo # Frontend URL >> apps\backend\.env
echo FRONTEND_URL="http://localhost:5173" >> apps\backend\.env
echo. >> apps\backend\.env
echo # Node Environment >> apps\backend\.env
echo NODE_ENV="development" >> apps\backend\.env
echo. >> apps\backend\.env
echo # Server Configuration >> apps\backend\.env
echo PORT=3001 >> apps\backend\.env

echo # API Configuration > apps\frontend\.env
echo VITE_API_URL=http://localhost:3001 >> apps\frontend\.env
echo. >> apps\frontend\.env
echo # Environment >> apps\frontend\.env
echo VITE_NODE_ENV=development >> apps\frontend\.env

echo Fichiers .env crees avec succes!

echo.
echo [3/6] Installation des dependances du monorepo...
call npm install

echo.
echo [4/6] Installation des dependances du backend...
cd apps\backend
call npm install
cd ..

echo.
echo [5/6] Installation des dependances du frontend...
cd frontend
call npm install
cd ..\..

echo.
echo [6/6] Generation du client Prisma...
cd apps\backend
call npx prisma generate
cd ..\..

echo.
echo ========================================
echo   INSTALLATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Installez PostgreSQL si ce n'est pas fait
echo 2. Creez une base de donnees nommee '360flow'
echo 3. Mettez a jour DATABASE_URL dans apps\backend\.env
echo 4. Lancez: npm run dev
echo.
echo Comptes de test:
echo - Admin: admin@360flow.com / password123
echo - Architect: architect@360flow.com / password123
echo - Client: client@360flow.com / password123
echo.
pause
