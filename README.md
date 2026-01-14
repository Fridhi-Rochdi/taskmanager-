# Task Manager API

Backend REST API professionnel construit avec NestJS, PostgreSQL, et des pratiques DevOps modernes.

[![CI/CD Pipeline](https://github.com/Fridhi-Rochdi/taskmanager-/actions/workflows/cicd.yml/badge.svg)](https://github.com/Fridhi-Rochdi/taskmanager-/actions/workflows/cicd.yml)

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [CI/CD](#-cicd)
- [API Documentation](#-api-documentation)

## ✨ Fonctionnalités

- **API RESTful** complète avec endpoints CRUD
- **Base de données PostgreSQL** avec TypeORM
- **Validation** des données avec class-validator
- **Logging structuré** avec Winston
- **Distributed tracing** avec trace ID et request ID
- **Métriques** pour monitoring et observabilité
- **Gestion d'erreurs** centralisée
- **Docker** support avec multi-stage builds
- **Health checks** pour production
- **Tests unitaires** avec couverture complète

## 🛠 Technologies

### Backend
- **NestJS** - Framework Node.js progressif
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données relationnelle
- **TypeORM** - ORM pour TypeScript

### Observabilité
- **Winston** - Logging structuré
- **Custom Metrics** - Collecte de métriques
- **Distributed Tracing** - Traçabilité des requêtes

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration locale
- **GitHub Actions** - CI/CD automatisé
- **ESLint & Prettier** - Qualité de code

## 🏗 Architecture

```
taskmanager/
├── src/
│   ├── common/          # Modules partagés (interceptors, filters, dto)
│   ├── config/          # Configuration (database, logging)
│   ├── metrics/         # Système de métriques
│   ├── types/           # Types TypeScript personnalisés
│   ├── users/           # Module utilisateurs (CRUD)
│   ├── app.module.ts    # Module principal
│   └── main.ts          # Point d'entrée
├── test/                # Tests unitaires et d'intégration
├── .github/workflows/   # CI/CD pipelines
├── Dockerfile           # Image Docker optimisée
└── docker-compose.yml   # Stack complète (API + PostgreSQL)
```

## 📦 Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL 15+
- Docker & Docker Compose (optionnel)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/Fridhi-Rochdi/taskmanager-.git
cd taskmanager

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

### Avec Docker

```bash
# Démarrer tous les services
docker-compose up -d

# L'API sera accessible sur http://localhost:3000
```

## ⚙ Configuration

Créer un fichier `.env` à la racine du projet:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=taskmanager

# Application
NODE_ENV=development
PORT=3000
```

## 🚀 Utilisation

### Développement

```bash
# Mode développement avec hot-reload
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start:prod
```

### Endpoints disponibles

- `GET /users` - Liste paginée des utilisateurs
- `GET /users/:id` - Détails d'un utilisateur
- `POST /users` - Créer un utilisateur
- `PATCH /users/:id` - Modifier un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur
- `GET /metrics` - Métriques de l'application
- `GET /health` - Health check

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:cov

# Tests en mode watch
npm run test:watch
```

### Couverture actuelle
- **17 tests** passent avec succès
- Couverture des services, controllers, et interceptors

## 🔄 CI/CD

Le projet utilise **GitHub Actions** pour l'intégration et le déploiement continus.

### Pipeline CI/CD

Le workflow [cicd.yml](.github/workflows/cicd.yml) exécute:

1. **Code Quality & Lint**
   - ESLint pour l'analyse statique
   - Prettier pour le formatage
   - TypeScript type checking

2. **Security Audit**
   - npm audit pour les vulnérabilités
   - Vérification des dépendances obsolètes

3. **Build Application**
   - Build sur Node.js 18, 20, 21
   - Upload des artifacts de build

4. **Unit Tests & Coverage**
   - Exécution de tous les tests
   - Génération du rapport de couverture

5. **Environment Configuration**
   - Validation des fichiers de config
   - Vérification Docker Compose

6. **CI Pipeline Success**
   - Récapitulatif de tous les checks

### Badges de statut

[![CI/CD Pipeline](https://github.com/Fridhi-Rochdi/taskmanager-/actions/workflows/cicd.yml/badge.svg)](https://github.com/Fridhi-Rochdi/taskmanager-/actions/workflows/cicd.yml)

## 📚 API Documentation

### Créer un utilisateur

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Lister les utilisateurs (paginé)

```http
GET /users?page=1&limit=10
```

### Obtenir les métriques

```http
GET /metrics
```

Retourne:
- Nombre total de requêtes
- Temps de réponse moyen
- Erreurs HTTP par code
- Nombre d'utilisateurs actifs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

MIT © Fridhi Rochdi

## 👤 Auteur

**Fridhi Rochdi**

- GitHub: [@Fridhi-Rochdi](https://github.com/Fridhi-Rochdi)

---

⭐ N'oubliez pas de donner une étoile si ce projet vous a aidé!
