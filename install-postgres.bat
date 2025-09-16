@echo off
echo ========================================
echo   INSTALLATION POSTGRESQL AUTOMATIQUE
echo ========================================
echo.

echo Installation de PostgreSQL via winget...
winget install PostgreSQL.PostgreSQL --accept-source-agreements --accept-package-agreements

echo.
echo ========================================
echo   POSTGRESQL INSTALLE!
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Redemarrez votre ordinateur
echo 2. Ouvrez pgAdmin ou psql
echo 3. Creez une base de donnees nommee '360flow'
echo 4. Mettez a jour DATABASE_URL dans apps\backend\.env
echo.
echo Exemple de DATABASE_URL:
echo DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/360flow?schema=public"
echo.
pause
