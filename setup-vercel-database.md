# 🗄️ Configuration Base de Données Vercel Postgres

## Étapes pour créer la base de données :

### 1. Aller sur Vercel Dashboard
- Ouvrez [vercel.com/dashboard](https://vercel.com/dashboard)
- Connectez-vous avec votre compte

### 2. Créer une base de données Postgres
- Cliquez sur **"Storage"** dans le menu de gauche
- Cliquez sur **"Create Database"**
- Sélectionnez **"Postgres"**
- Nom : `360flow-database`
- Région : `Washington, D.C., USA` (ou plus proche de vous)

### 3. Récupérer les variables d'environnement
Après création, copiez ces variables :

```bash
# Database (Vercel Postgres)
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_URL=postgresql://username:password@host:port/database
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database
POSTGRES_USER=username
POSTGRES_HOST=host
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
```

### 4. Configurer les variables dans le projet
- Allez dans votre projet backend sur Vercel
- Cliquez sur **"Settings"** → **"Environment Variables"**
- Ajoutez toutes les variables ci-dessus

### 5. JWT Secrets
Ajoutez aussi ces variables :

```bash
JWT_SECRET=360flow-super-secret-jwt-key-production-2024
JWT_REFRESH_SECRET=360flow-super-secret-refresh-key-production-2024
FRONTEND_URL=https://votre-frontend-url.vercel.app
NODE_ENV=production
```

## ✅ Votre base de données sera prête !
