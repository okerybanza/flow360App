# 360Flow - Plateforme de Gestion de Projets

**360Flow** est une plateforme complète de gestion de projets pour architectes et entrepreneurs, développée avec une architecture moderne et des technologies de pointe.

## 🏗️ Architecture

### Stack Technique
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Node.js + NestJS + TypeScript
- **Base de données**: PostgreSQL 15
- **ORM**: Prisma
- **Authentification**: JWT avec refresh token
- **Architecture**: Monorepo avec Turborepo

### Structure du Projet
```
360flow/
├── apps/
│   ├── backend/          # API NestJS
│   └── frontend/         # Application React
├── packages/
│   └── shared/           # Code partagé (futur)
├── package.json          # Configuration monorepo
└── turbo.json           # Configuration Turborepo
```

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- PostgreSQL 15+
- Yarn ou npm

### 1. Installation des dépendances

```bash
# Installation des dépendances du monorepo
yarn install

# Ou avec npm
npm install
```

### 2. Configuration de la base de données

1. Créez une base de données PostgreSQL :
```sql
CREATE DATABASE "360flow";
```

2. Configurez les variables d'environnement :
```bash
# Copiez le fichier d'exemple
cp apps/backend/.env.example apps/backend/.env

# Éditez le fichier .env avec vos paramètres
DATABASE_URL="postgresql://username:password@localhost:5432/360flow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
```

### 3. Initialisation de la base de données

```bash
# Génération du client Prisma
yarn db:generate

# Migration de la base de données
yarn db:migrate

# Seed des données de test
yarn db:seed
```

### 4. Lancement de l'application

```bash
# Lancement en mode développement (frontend + backend)
yarn dev

# Ou lancement séparé
yarn workspace @360flow/backend dev  # Backend sur http://localhost:3001
yarn workspace @360flow/frontend dev # Frontend sur http://localhost:5173
```

## 📋 Comptes de Test

Après avoir lancé le seed, vous pouvez vous connecter avec :

- **Admin**: `admin@360flow.com` / `password123`
- **Architecte**: `architect@360flow.com` / `password123`
- **Client**: `client@360flow.com` / `password123`

## 🎯 Fonctionnalités

### Authentification
- ✅ Login/Logout/Register
- ✅ Rôles : Admin, Architecte, Client
- ✅ JWT avec refresh token
- ✅ Protection des routes par rôle

### Dashboard
- ✅ Statistiques rapides (clients, projets, budget)
- ✅ Vue d'ensemble des activités récentes
- ✅ Métriques en temps réel

### Gestion des Clients & Projets
- ✅ Tableau des clients avec expansion
- ✅ Vue détaillée des projets
- ✅ Gestion des membres de projet
- ✅ Statuts et budgets

### Page Projet (Onglets)
- ✅ **Aperçu** : Description, dates, budget, statut
- ✅ **Matériaux** : Liste avec ajout/modification
- ✅ **Fichiers** : Upload et gestion de documents
- ✅ **Discussions** : Chat entre équipe et client

### Paramètres
- ✅ Informations société
- ✅ Gestion des utilisateurs
- ✅ Configuration de la devise

## 🔧 API Documentation

L'API est documentée avec Swagger et accessible à :
- **URL**: http://localhost:3001/api
- **Authentification**: Bearer Token

### Endpoints Principaux

#### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `POST /auth/refresh` - Rafraîchissement du token
- `GET /auth/me` - Profil utilisateur

#### Clients
- `GET /clients` - Liste des clients
- `GET /clients/:id` - Détails d'un client
- `POST /clients` - Créer un client
- `PATCH /clients/:id` - Modifier un client
- `DELETE /clients/:id` - Supprimer un client
- `GET /clients/stats` - Statistiques clients

#### Projets
- `GET /projects` - Liste des projets
- `GET /projects/:id` - Détails d'un projet
- `POST /projects` - Créer un projet
- `PATCH /projects/:id` - Modifier un projet
- `DELETE /projects/:id` - Supprimer un projet
- `GET /projects/stats` - Statistiques projets

#### Matériaux
- `GET /materials` - Liste des matériaux
- `GET /materials/project/:projectId` - Matériaux d'un projet
- `POST /materials` - Ajouter un matériau
- `PATCH /materials/:id` - Modifier un matériau
- `DELETE /materials/:id` - Supprimer un matériau

#### Fichiers
- `GET /files` - Liste des fichiers
- `GET /files/project/:projectId` - Fichiers d'un projet
- `POST /files` - Upload d'un fichier
- `DELETE /files/:id` - Supprimer un fichier

#### Messages
- `GET /messages/project/:projectId` - Messages d'un projet
- `POST /messages` - Envoyer un message
- `PATCH /messages/:id` - Modifier un message
- `DELETE /messages/:id` - Supprimer un message

## 🛠️ Scripts Disponibles

```bash
# Développement
yarn dev                    # Lance frontend + backend
yarn build                  # Build de tous les packages
yarn lint                   # Lint de tous les packages

# Base de données
yarn db:generate           # Générer le client Prisma
yarn db:migrate            # Appliquer les migrations
yarn db:seed               # Seed des données de test
yarn db:studio             # Ouvrir Prisma Studio

# Packages individuels
yarn workspace @360flow/backend dev    # Backend seulement
yarn workspace @360flow/frontend dev   # Frontend seulement
```

## 📁 Structure des Fichiers

### Backend (NestJS)
```
apps/backend/
├── src/
│   ├── auth/              # Authentification JWT
│   ├── users/             # Gestion des utilisateurs
│   ├── clients/           # Gestion des clients
│   ├── projects/          # Gestion des projets
│   ├── materials/         # Gestion des matériaux
│   ├── files/             # Gestion des fichiers
│   ├── messages/          # Gestion des messages
│   └── common/            # Services partagés
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts           # Données de test
└── package.json
```

### Frontend (React)
```
apps/frontend/
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # Composants shadcn/ui
│   │   └── Layout.tsx    # Layout principal
│   ├── pages/            # Pages de l'application
│   ├── hooks/            # Hooks personnalisés
│   ├── lib/              # Utilitaires et API
│   ├── types/            # Types TypeScript
│   └── utils/            # Fonctions utilitaires
└── package.json
```

## 🎨 Interface Utilisateur

L'application utilise **shadcn/ui** pour une interface moderne et cohérente :

- **Design System** : Composants réutilisables
- **Responsive** : Desktop-first avec adaptation mobile
- **Accessibilité** : Conforme aux standards WCAG
- **Thème** : Support du mode sombre/clair
- **Animations** : Transitions fluides avec Framer Motion

## 🔒 Sécurité

- **Authentification** : JWT avec refresh token
- **Validation** : Class-validator côté backend
- **CORS** : Configuration sécurisée
- **Rate Limiting** : Protection contre les attaques
- **Input Sanitization** : Nettoyage des données

## 🚀 Déploiement

### Production
```bash
# Build de production
yarn build

# Variables d'environnement
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
```

### Docker (Optionnel)
```dockerfile
# Dockerfile pour le backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation API sur `/api`
- Vérifiez les logs de l'application

---

**360Flow** - Simplifiez la gestion de vos projets architecturaux ! 🏗️✨
