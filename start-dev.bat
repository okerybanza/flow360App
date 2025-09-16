@echo off
echo ========================================
echo   360FLOW - DEMARRAGE EN MODE DEV
echo ========================================
echo.

echo Verification de la base de donnees...
cd apps\backend
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de se connecter a la base de donnees.
    echo Verifiez que PostgreSQL est installe et que la base '360flow' existe.
    echo Mettez a jour DATABASE_URL dans apps\backend\.env
    pause
    exit /b 1
)

echo.
echo Seeding de la base de donnees...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ATTENTION: Erreur lors du seeding, mais on continue...
)

cd ..\..

echo.
echo Demarrage des serveurs de developpement...
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter les serveurs
echo.

call npm run dev
