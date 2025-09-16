# 🚀 PROCÉDURE DE DÉPLOIEMENT VERCEL - 360FLOW

## 📋 PRÉREQUIS

- [ ] Compte Vercel actif
- [ ] Repository GitHub/GitLab avec le code 360Flow
- [ ] Accès aux fichiers du projet dans : `D:\Me\Buildflow light last\`

---

## 🗄️ ÉTAPE 1 : CRÉER LA BASE DE DONNÉES

### 1.1 Créer Vercel Postgres

```
1. Aller sur https://vercel.com/dashboard
2. Cliquer sur "Storage" dans le menu de gauche
3. Cliquer "Create Database"
4. Sélectionner "Postgres"
5. Nom de la base : 360flow-database
6. Région : choisir la plus proche (Europe West 1 pour la France)
7. Cliquer "Create"
```

### 1.2 Récupérer les variables d'environnement

```
1. Une fois la base créée, aller dans l'onglet "Settings"
2. Copier TOUTES les variables affichées :
   - DATABASE_URL
   - POSTGRES_URL
   - POSTGRES_PRISMA_URL
   - POSTGRES_URL_NON_POOLING
   - POSTGRES_USER
   - POSTGRES_HOST
   - POSTGRES_PASSWORD
   - POSTGRES_DATABASE
```

**⚠️ IMPORTANT : Gardez ces variables dans un fichier temporaire, vous en aurez besoin !**

---

## 🔧 ÉTAPE 2 : DÉPLOYER LE BACKEND

### 2.1 Créer le projet Backend

```
1. Sur https://vercel.com/dashboard
2. Cliquer "New Project"
3. Importer votre repository GitHub/GitLab
4. Configuration du projet :
   - Project Name : 360flow-backend
   - Framework Preset : Other
   - Root Directory : apps/backend
   - Build Command : npm run build:vercel
   - Output Directory : dist
   - Install Command : npm install
5. Cliquer "Deploy" (le premier déploiement va échouer, c'est normal)
```

### 2.2 Configurer les variables d'environnement Backend

```
1. Aller dans Settings → Environment Variables
2. Ajouter ces variables UNE PAR UNE :

DATABASE_URL=postgresql://[copier depuis Vercel Postgres]
POSTGRES_URL=postgresql://[copier depuis Vercel Postgres]
POSTGRES_PRISMA_URL=postgresql://[copier depuis Vercel Postgres]
POSTGRES_URL_NON_POOLING=postgresql://[copier depuis Vercel Postgres]
POSTGRES_USER=[copier depuis Vercel Postgres]
POSTGRES_HOST=[copier depuis Vercel Postgres]
POSTGRES_PASSWORD=[copier depuis Vercel Postgres]
POSTGRES_DATABASE=[copier depuis Vercel Postgres]

JWT_SECRET=votre-super-secret-jwt-de-minimum-32-caracteres-ici
JWT_REFRESH_SECRET=votre-autre-super-secret-refresh-de-minimum-32-caracteres

NODE_ENV=production

3. Pour chaque variable :
   - Name : [nom de la variable]
   - Value : [valeur]
   - Environments : cocher Production, Preview, Development
   - Cliquer "Save"
```

### 2.3 Redéployer le Backend

```
1. Aller dans l'onglet "Deployments"
2. Cliquer sur les 3 points du dernier déploiement
3. Cliquer "Redeploy"
4. Attendre que le statut soit "Ready"
```

### 2.4 Noter l'URL du Backend

```
URL Backend : https://360flow-backend.vercel.app
(Copier cette URL, vous en aurez besoin pour le frontend)
```

---

## 🎨 ÉTAPE 3 : DÉPLOYER LE FRONTEND

### 3.1 Créer le projet Frontend

```
1. Sur https://vercel.com/dashboard
2. Cliquer "New Project"
3. Importer le MÊME repository
4. Configuration du projet :
   - Project Name : 360flow-frontend
   - Framework Preset : Vite
   - Root Directory : apps/frontend
   - Build Command : npm run build
   - Output Directory : dist
   - Install Command : npm install
5. Cliquer "Deploy" (le premier déploiement va échouer, c'est normal)
```

### 3.2 Configurer les variables d'environnement Frontend

```
1. Aller dans Settings → Environment Variables
2. Ajouter cette variable :

VITE_API_URL=https://360flow-backend.vercel.app

3. Configuration :
   - Name : VITE_API_URL
   - Value : https://360flow-backend.vercel.app
   - Environments : cocher Production, Preview, Development
   - Cliquer "Save"
```

### 3.3 Redéployer le Frontend

```
1. Aller dans l'onglet "Deployments"
2. Cliquer sur les 3 points du dernier déploiement
3. Cliquer "Redeploy"
4. Attendre que le statut soit "Ready"
```

### 3.4 Noter l'URL du Frontend

```
URL Frontend : https://360flow-frontend.vercel.app
```

---

## 🔄 ÉTAPE 4 : CONFIGURER LA COMMUNICATION

### 4.1 Mettre à jour les variables CORS du Backend

```
1. Retourner sur le projet Backend (360flow-backend)
2. Aller dans Settings → Environment Variables
3. Ajouter cette variable :

FRONTEND_URL=https://360flow-frontend.vercel.app

4. Configuration :
   - Name : FRONTEND_URL
   - Value : https://360flow-frontend.vercel.app
   - Environments : cocher Production, Preview, Development
   - Cliquer "Save"
```

### 4.2 Redéployer le Backend avec CORS

```
1. Aller dans l'onglet "Deployments" du Backend
2. Cliquer sur les 3 points du dernier déploiement
3. Cliquer "Redeploy"
4. Attendre que le statut soit "Ready"
```

---

## 🗄️ ÉTAPE 5 : INITIALISER LA BASE DE DONNÉES

### 5.1 Exécuter les migrations

```
1. Aller sur le projet Backend : https://360flow-backend.vercel.app
2. Dans l'URL, ajouter : /api/seed
3. URL complète : https://360flow-backend.vercel.app/api/seed
4. Ouvrir cette URL dans le navigateur
5. Vous devriez voir un message de succès
```

**OU si le endpoint /api/seed n'existe pas :**

```
1. Ouvrir un terminal local
2. Aller dans le dossier : D:\Me\Buildflow light last\apps\backend
3. Créer un fichier .env avec :
   DATABASE_URL=[copier la valeur depuis Vercel]
4. Exécuter :
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
```

---

## ✅ ÉTAPE 6 : TESTER LE DÉPLOIEMENT

### 6.1 Tester l'API Backend

```
1. Ouvrir : https://360flow-backend.vercel.app
2. Vous devriez voir une page ou un message d'API
3. Tester l'authentification : https://360flow-backend.vercel.app/api
```

### 6.2 Tester le Frontend

```
1. Ouvrir : https://360flow-frontend.vercel.app
2. Vous devriez voir la page de connexion
3. Tester avec les comptes :
   - admin@360flow.com / password123
   - architect@360flow.com / password123
   - client@360flow.com / password123
```

### 6.3 Tester la communication Frontend-Backend

```
1. Sur le frontend, essayer de se connecter
2. Vérifier que le dashboard s'affiche
3. Tester la création d'un client ou projet
4. Vérifier l'upload de fichiers
```

---

## 🔧 DÉPANNAGE

### Erreur "CORS" ou "Network Error"

```
1. Vérifier que FRONTEND_URL est bien configuré dans le Backend
2. Vérifier que VITE_API_URL est bien configuré dans le Frontend
3. Redéployer les deux projets
```

### Erreur "Database connection"

```
1. Vérifier toutes les variables DATABASE_* dans le Backend
2. S'assurer que la base Vercel Postgres est active
3. Tester la connexion depuis Vercel Postgres dashboard
```

### Erreur "Build failed"

```
1. Vérifier que Root Directory est correct
2. Vérifier que Build Command est correct
3. Regarder les logs de build dans Vercel
```

### Page blanche sur le Frontend

```
1. Vérifier que VITE_API_URL commence par https://
2. Vérifier les logs dans la console du navigateur (F12)
3. Tester l'URL de l'API directement
```

---

## 📝 RÉCAPITULATIF DES URLS

```
Base de données : 360flow-database (Vercel Postgres)
Backend API    : https://360flow-backend.vercel.app
Frontend App   : https://360flow-frontend.vercel.app

Comptes de test :
- admin@360flow.com / password123
- architect@360flow.com / password123  
- client@360flow.com / password123
```

---

## 🎯 CHECKLIST FINALE

- [ ] Base de données Vercel Postgres créée
- [ ] Backend déployé avec toutes les variables d'environnement
- [ ] Frontend déployé avec VITE_API_URL
- [ ] Variables CORS configurées (FRONTEND_URL)
- [ ] Base de données initialisée (migrations + seed)
- [ ] Tests de connexion réussis
- [ ] Communication Frontend-Backend fonctionnelle

**🎉 FÉLICITATIONS ! Votre application 360Flow est maintenant déployée sur Vercel !**

---

## 📞 SUPPORT

En cas de problème :

1. Vérifier les logs dans Vercel Dashboard → Deployments → View Logs
2. Tester les URLs individuellement
3. Vérifier la console du navigateur (F12) pour les erreurs frontend
4. S'assurer que toutes les variables d'environnement sont correctes

**Temps estimé total : 30-45 minutes**

