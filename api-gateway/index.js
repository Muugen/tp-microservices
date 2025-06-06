const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration des services
const services = {
  musique: {
    target: process.env.MUSIQUE_SERVICE_URL || "http://api-musique:2500",
    name: "API Musique",
  },
  jeux: {
    target: process.env.JEUX_SERVICE_URL || "http://api-jeux:3000",
    name: "API Jeux",
  },
};

// Proxy pour l'API Musique
app.use(
  "/api/musiques",
  createProxyMiddleware({
    target: services.musique.target,
    changeOrigin: true,
    pathRewrite: {
      "^/api/musiques": "/musiques",
    },
    onError: (err, req, res) => {
      console.error("Erreur proxy API Musique:", err.message);
      res.status(500).json({
        success: false,
        message: "Service API Musique non disponible",
        error: err.message,
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `🎵 Redirection vers ${services.musique.name}: ${req.method} ${req.url}`
      );
    },
  })
);

// Proxy pour l'API Jeux
app.use(
  "/api/jeux",
  createProxyMiddleware({
    target: services.jeux.target,
    changeOrigin: true,
    pathRewrite: {
      "^/api/jeux": "/jeux",
    },
    onError: (err, req, res) => {
      console.error("Erreur proxy API Jeux:", err.message);
      res.status(500).json({
        success: false,
        message: "Service API Jeux non disponible",
        error: err.message,
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `🎲 Redirection vers ${services.jeux.name}: ${req.method} ${req.url}`
      );
    },
  })
);

// Proxy pour les routes de santé
app.use(
  "/api/health/musique",
  createProxyMiddleware({
    target: services.musique.target,
    changeOrigin: true,
    pathRewrite: {
      "^/api/health/musique": "/health",
    },
  })
);

app.use(
  "/api/health/jeux",
  createProxyMiddleware({
    target: services.jeux.target,
    changeOrigin: true,
    pathRewrite: {
      "^/api/health/jeux": "/health",
    },
  })
);

// Route de santé globale
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "API Gateway",
    status: "En fonctionnement",
    port: PORT,
    services: {
      musique: services.musique.target,
      jeux: services.jeux.target,
    },
  });
});

// Route d'information sur les services disponibles
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway - Microservices Musique et Jeux",
    endpoints: {
      musique: {
        base: "/api/musiques",
        description: "CRUD pour la gestion des musiques",
        routes: [
          "GET /api/musiques - Lister toutes les musiques",
          "GET /api/musiques/:id - Récupérer une musique",
          "POST /api/musiques - Ajouter une musique",
          "PUT /api/musiques/:id - Modifier une musique",
          "DELETE /api/musiques/:id - Supprimer une musique",
        ],
      },
      jeux: {
        base: "/api/jeux",
        description: "CRUD pour la gestion des jeux de société",
        routes: [
          "GET /api/jeux - Lister tous les jeux",
          "GET /api/jeux/:id - Récupérer un jeu",
          "POST /api/jeux - Ajouter un jeu",
          "PUT /api/jeux/:id - Modifier un jeu",
          "DELETE /api/jeux/:id - Supprimer un jeu",
        ],
      },
      health: {
        global: "GET /health - État de l'API Gateway",
        musique: "GET /api/health/musique - État de l'API Musique",
        jeux: "GET /api/health/jeux - État de l'API Jeux",
      },
    },
  });
});

// Route par défaut
app.get("/", (req, res) => {
  res.redirect("/api");
});

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    availableEndpoints: "/api",
  });
});

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚪 API Gateway en cours d'exécution sur le port ${PORT}`);
  console.log(`📋 Documentation disponible sur: http://localhost:${PORT}/api`);
});
