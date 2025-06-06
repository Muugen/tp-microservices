# TP Microservices avec Docker

## 🎯 Objectif

Ce projet illustre les fondamentaux des microservices et leur intégration avec Docker. Il démontre comment créer une architecture de microservices avec une API Gateway pour gérer les communications.

## 📋 Rappels Docker

### Qu'est-ce qu'une image Docker ?

Une **image Docker** est un modèle en lecture seule qui contient le code de l'application, les dépendances, les bibliothèques et tout ce qui est nécessaire pour faire fonctionner l'application. C'est un "blueprint" pour créer des conteneurs.

### Qu'est-ce qu'un conteneur Docker ?

Un **conteneur Docker** est une instance en cours d'exécution d'une image Docker. Il est isolé du système hôte et des autres conteneurs, mais partage le même noyau du système d'exploitation.

### À quoi sert Docker Compose ?

**Docker Compose** est un outil qui permet de définir et gérer des applications multi-conteneurs. Il utilise un fichier YAML pour configurer les services de l'application et peut créer et démarrer tous les services avec une seule commande.

## 🏗️ Architecture du Projet

```
tp-microservices/
├── api-musique/           # Microservice pour la gestion des musiques (Port 2500)
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
├── api-jeux/              # Microservice pour la gestion des jeux (Port 3000)
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
├── api-gateway/           # API Gateway (Port 8080)
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
├── docker-compose.yml     # Orchestration des services
├── architecture-diagram.md # Diagramme d'architecture Mermaid
└── README.md
```

📊 **[Voir le diagramme d'architecture détaillé](./architecture-diagram.md)**

## 🚀 Services Disponibles

### 1. API Musique (Port 2500)

Gestion CRUD des musiques avec les endpoints :

- `GET /musiques` - Lister toutes les musiques
- `GET /musiques/:id` - Récupérer une musique par ID
- `POST /musiques` - Ajouter une nouvelle musique
- `PUT /musiques/:id` - Modifier une musique
- `DELETE /musiques/:id` - Supprimer une musique
- `GET /health` - État de santé du service

### 2. API Jeux (Port 3000)

Gestion CRUD des jeux de société avec les endpoints :

- `GET /jeux` - Lister tous les jeux
- `GET /jeux/:id` - Récupérer un jeu par ID
- `POST /jeux` - Ajouter un nouveau jeu
- `PUT /jeux/:id` - Modifier un jeu
- `DELETE /jeux/:id` - Supprimer un jeu
- `GET /health` - État de santé du service

### 3. API Gateway (Port 8080)

Point d'entrée unique qui redirige les requêtes vers les microservices :

- `GET /api` - Documentation des endpoints disponibles
- `GET /api/musiques/*` - Proxy vers l'API Musique
- `GET /api/jeux/*` - Proxy vers l'API Jeux
- `GET /health` - État de santé de l'API Gateway
- `GET /api/health/musique` - État de l'API Musique via le Gateway
- `GET /api/health/jeux` - État de l'API Jeux via le Gateway

## 🔧 Installation et Démarrage

### Prérequis

- Docker et Docker Compose installés
- pnpm (optionnel pour le développement local)

### Démarrage avec Docker Compose

```bash
cd tp-microservices
docker-compose up --build
```

### Démarrage en mode développement (optionnel)

```bash
# Terminal 1 - API Musique
cd api-musique
pnpm install
pnpm run dev

# Terminal 2 - API Jeux
cd api-jeux
pnpm install
pnpm run dev

# Terminal 3 - API Gateway
cd api-gateway
pnpm install
pnpm run dev
```

## 🔒 Sécurité

### Architecture Sécurisée

- **Seule l'API Gateway** est exposée à l'extérieur (port 8080)
- **Les APIs Musique et Jeux** ne sont **pas accessibles directement** depuis l'extérieur
- Communication interne via le réseau Docker `microservices-network`
- Les APIs écoutent sur `0.0.0.0` pour permettre la communication Docker interne

### Réseau Docker

Oui, il est nécessaire de créer un réseau Docker personnalisé pour que :

- Les conteneurs puissent communiquer entre eux par leur nom
- L'isolation soit assurée vis-à-vis d'autres projets Docker
- La résolution DNS interne fonctionne correctement

## 🧪 Tests

### Test direct des APIs (avant sécurisation)

```bash
# API Musique
curl http://localhost:2500/health
curl http://localhost:2500/musiques

# API Jeux
curl http://localhost:3000/health
curl http://localhost:3000/jeux
```

### Test via l'API Gateway (recommandé)

```bash
# Documentation
curl http://localhost:8080/api

# Test des musiques via Gateway
curl http://localhost:8080/api/musiques
curl http://localhost:8080/api/musiques/1

# Test des jeux via Gateway
curl http://localhost:8080/api/jeux
curl http://localhost:8080/api/jeux/1

# Test de santé
curl http://localhost:8080/health
curl http://localhost:8080/api/health/musique
curl http://localhost:8080/api/health/jeux
```

### Ajout d'une musique via Gateway

```bash
curl -X POST http://localhost:8080/api/musiques \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Stairway to Heaven",
    "artiste": "Led Zeppelin",
    "genre": "Rock",
    "annee": 1971
  }'
```

## 🚀 CI/CD et Déploiement

### Configuration GitHub Actions

Le fichier `.github/workflows/docker.yml` automatise :

1. **Construction** de l'image Docker de l'API Musique
2. **Connexion** à Docker Hub
3. **Publication** de l'image avec des tags appropriés
4. **Déclenchement** du déploiement sur Render

### Variables de secrets requises

Configurez ces secrets dans votre repository GitHub :

- `DOCKERHUB_USERNAME` : Votre nom d'utilisateur Docker Hub
- `DOCKERHUB_TOKEN` : Token d'accès Docker Hub
- `RENDER_DEPLOY_HOOK_URL` : URL du webhook Render (optionnel)

### Déploiement sur Render

#### Port d'exposition

- **Port utilisé** : Le port défini dans la variable d'environnement `PORT` de Render
- **Détection automatique** : Render détecte automatiquement le port exposé via l'instruction `EXPOSE` dans le Dockerfile
- **Configuration** : Render mappe automatiquement le port exposé vers le port HTTPS (443) public

#### Comment Render devine le port

1. Render lit l'instruction `EXPOSE 2500` dans le Dockerfile
2. Il configure automatiquement le routage pour rediriger le trafic HTTPS vers ce port
3. L'application écoute sur le port défini par `process.env.PORT` (fourni par Render)

### Webhook Automatique

Pour automatiser le déploiement :

1. Récupérez l'URL du webhook dans les paramètres du service Render
2. Ajoutez-la comme secret `RENDER_DEPLOY_HOOK_URL` dans GitHub
3. Chaque push déclenchera automatiquement le déploiement

## 📊 Avantages des Microservices

1. **Indépendance** : Chaque service peut être développé, testé et déployé séparément
2. **Scalabilité** : Possibilité de faire évoluer chaque service indépendamment
3. **Technologie** : Chaque service peut utiliser des technologies différentes
4. **Résilience** : La panne d'un service n'affecte pas les autres
5. **Équipes** : Différentes équipes peuvent travailler sur différents services

## 🔮 Évolutions Possibles

- Ajout d'une base de données pour chaque microservice
- Implémentation de l'authentification et autorisation
- Mise en place de monitoring et logging centralisés
- Ajout de tests automatisés
- Configuration avec des variables d'environnement
- Mise en place de la découverte de services
- Implémentation de circuit breakers pour la résilience

## 📝 Notes Importantes

- Les données sont stockées en mémoire et sont perdues au redémarrage
- L'architecture respecte les principes des microservices
- La communication se fait via HTTP/REST
- L'API Gateway centralise les accès et simplifie la gestion
