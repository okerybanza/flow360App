# 🚀 360FLOW - GUIDE DE DÉPLOIEMENT VERCEL

## 📋 INFORMATIONS GÉNÉRALES

### 📁 **Localisation du projet :**
```
C:\Users\ERIC - BANZA\Downloads\Temporaire\Buildflow light last\
```

### 🏗️ **Architecture :**
- **Monorepo** avec Turborepo
- **Frontend** : React 18 + Vite + TypeScript + TailwindCSS
- **Backend** : NestJS + TypeScript + Prisma ORM
- **Base de données** : PostgreSQL (Vercel Postgres)

---

## ✅ ÉTAT ACTUEL DU PROJET

### 🎯 **Statut :**
- ✅ **Projet organisé** et isolé dans un dossier propre
- ✅ **Erreurs TypeScript corrigées** (seed.service.ts)
- ✅ **Configuration Vercel optimisée** (vercel.json)
- ✅ **Scripts de build** prêts (build:vercel)
- ✅ **Variables d'environnement** préparées
- ✅ **Structure monorepo** fonctionnelle

### 📊 **Fonctionnalités principales :**
- Gestion d'utilisateurs (ADMIN, ARCHITECT, CLIENT)
- Gestion de projets avec étapes et tâches
- Gestion de clients et matériaux
- Système de messagerie avec fichiers
- Templates de projets réutilisables
- Upload de fichiers et commentaires

---

## 🔑 COMPTES DE TEST

```
Admin:     admin@360flow.com     / password123
Architect: architect@360flow.com / password123  
Client:    client@360flow.com    / password123
```

---

## ⚙️ CONFIGURATION VERCEL

### 📄 **Fichiers de configuration :**
- `vercel.json` : Configuration optimisée pour monorepo
- `vercel-env-template.txt` : Template des variables d'environnement
- `apps/backend/package.json` : Scripts de build optimisés

### 🏗️ **Build Configuration :**
- **Build Command** : `npm run build:vercel`
- **Output Directory** : `dist`
- **Root Directory** : `apps/backend` (pour le backend)

---

## 🗄️ BASE DE DONNÉES

### 📊 **Schéma Prisma :**
- **Type** : PostgreSQL
- **Modèles** : 15+ modèles (User, Project, Client, Material, etc.)
- **Migrations** : Prêtes à exécuter
- **Seed** : Comptes de test intégrés

### 🔧 **Fichiers importants :**
- `apps/backend/prisma/schema.prisma` : Schéma de base de données
- `apps/backend/src/seed/seed.service.ts` : Script de seed avec comptes de test

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

### **Étape 1 : Créer la base de données Vercel Postgres**
1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquer sur **"Storage"**
3. Créer une **"Postgres Database"**
4. Nom : `360flow-database`

### **Étape 2 : Créer le projet Backend**
1. **New Project** → Importer le repository GitHub
2. **Project Name** : `360flow-backend`
3. **Root Directory** : `apps/backend`
4. **Build Command** : `npm run build:vercel`
5. **Output Directory** : `dist`

### **Étape 3 : Configurer les variables d'environnement**
Copier les variables de la base de données Postgres dans le projet Vercel :

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

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random

# Frontend URL (will be set after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Node Environment
NODE_ENV=production
```

### **Étape 4 : Créer le projet Frontend**
1. **New Project** → Importer le même repository
2. **Project Name** : `360flow-frontend`
3. **Root Directory** : `apps/frontend`
4. **Build Command** : `npm run build`
5. **Output Directory** : `dist`

### **Étape 5 : Configurer le Frontend**
Ajouter la variable d'environnement :
```bash
VITE_API_URL=https://360flow-backend.vercel.app
```

---

## 📁 STRUCTURE DU PROJET

```
Buildflow light last/
├── apps/
│   ├── backend/          # Backend NestJS
│   │   ├── src/         # Code source
│   │   │   ├── auth/    # Authentification
│   │   │   ├── clients/ # Gestion clients
│   │   │   ├── projects/# Gestion projets
│   │   │   ├── seed/    # Scripts de seed
│   │   │   └── ...
│   │   ├── prisma/      # Base de données
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── dist/        # Build
│   │   └── package.json
│   └── frontend/         # Frontend React
│       ├── src/         # Code source
│       │   ├── components/
│       │   ├── pages/
│       │   ├── lib/
│       │   └── ...
│       ├── dist/        # Build
│       └── package.json
├── package.json          # Configuration monorepo
├── turbo.json           # Configuration Turborepo
├── vercel.json          # Configuration Vercel
├── vercel-env-template.txt # Variables d'environnement
├── README.md            # Documentation
└── .gitignore           # Fichiers à ignorer
```

---

## 🔧 CORRECTIONS APPLIQUÉES

### **Erreurs TypeScript corrigées :**
1. **Client model** : `name` → `firstName` + `lastName`
2. **Project model** : `name` → `title` et `status: 'PLANNING'` → `status: 'DRAFT'`

### **Configuration Vercel optimisée :**
- Configuration monorepo simplifiée
- Scripts de build optimisés
- Variables d'environnement préparées

---

## 🎯 INSTRUCTIONS POUR LE NOUVEAU CHAT

**Copiez ce message :**
> "Voici mon projet 360Flow prêt pour déploiement Vercel. Le projet est organisé dans le dossier 'Buildflow light last'. Toutes les erreurs sont corrigées et la configuration Vercel est optimisée. Je veux déployer sur Vercel maintenant. Voici les comptes de test : admin@360flow.com/password123, architect@360flow.com/password123, client@360flow.com/password123."

---

## 🚨 NOTES IMPORTANTES

- ✅ Projet **100% prêt** pour déploiement
- ✅ **Erreurs corrigées** (TypeScript)
- ✅ **Configuration optimisée** pour Vercel
- ✅ **Comptes de test** fonctionnels
- ✅ **Structure organisée** et professionnelle

---

## 📞 SUPPORT

En cas de problème, vérifiez :
1. Les variables d'environnement sont correctement configurées
2. La base de données Vercel Postgres est créée
3. Les URLs des projets sont correctes
4. Les comptes de test sont fonctionnels

**Le projet est parfaitement organisé et prêt pour le déploiement !** 🚀
