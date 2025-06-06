const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 2500;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données en mémoire
let musiques = [
  {
    id: 1,
    titre: "Bohemian Rhapsody",
    artiste: "Queen",
    genre: "Rock",
    annee: 1975,
  },
  {
    id: 2,
    titre: "Imagine",
    artiste: "John Lennon",
    genre: "Pop",
    annee: 1971,
  },
  {
    id: 3,
    titre: "Hotel California",
    artiste: "Eagles",
    genre: "Rock",
    annee: 1976,
  },
];
let nextId = 4;

// Routes

// GET /musiques - Lister toutes les musiques
app.get("/musiques", (req, res) => {
  res.json({
    success: true,
    data: musiques,
    message: "Liste des musiques récupérée avec succès",
  });
});

// GET /musiques/:id - Récupérer une musique par ID
app.get("/musiques/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const musique = musiques.find((m) => m.id === id);

  if (!musique) {
    return res.status(404).json({
      success: false,
      message: "Musique non trouvée",
    });
  }

  res.json({
    success: true,
    data: musique,
    message: "Musique récupérée avec succès",
  });
});

// POST /musiques - Ajouter une nouvelle musique
app.post("/musiques", (req, res) => {
  const { titre, artiste, genre, annee } = req.body;

  if (!titre || !artiste) {
    return res.status(400).json({
      success: false,
      message: "Le titre et l'artiste sont obligatoires",
    });
  }

  const nouvelleMusique = {
    id: nextId++,
    titre,
    artiste,
    genre: genre || "Non spécifié",
    annee: annee || null,
  };

  musiques.push(nouvelleMusique);

  res.status(201).json({
    success: true,
    data: nouvelleMusique,
    message: "Musique ajoutée avec succès",
  });
});

// PUT /musiques/:id - Modifier une musique
app.put("/musiques/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { titre, artiste, genre, annee } = req.body;

  const index = musiques.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Musique non trouvée",
    });
  }

  musiques[index] = {
    ...musiques[index],
    titre: titre || musiques[index].titre,
    artiste: artiste || musiques[index].artiste,
    genre: genre || musiques[index].genre,
    annee: annee !== undefined ? annee : musiques[index].annee,
  };

  res.json({
    success: true,
    data: musiques[index],
    message: "Musique modifiée avec succès",
  });
});

// DELETE /musiques/:id - Supprimer une musique
app.delete("/musiques/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = musiques.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Musique non trouvée",
    });
  }

  const musiqueSupprimer = musiques.splice(index, 1)[0];

  res.json({
    success: true,
    data: musiqueSupprimer,
    message: "Musique supprimée avec succès",
  });
});

// Route pour récupérer une musique aléatoire (pour tester la CI/CD)
app.get("/musiques/random", (req, res) => {
  if (musiques.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Aucune musique disponible",
    });
  }

  const musiqueAleatoire =
    musiques[Math.floor(Math.random() * musiques.length)];

  res.json({
    success: true,
    data: musiqueAleatoire,
    message: "Musique aléatoire récupérée avec succès",
  });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "API Musique",
    status: "En fonctionnement",
    port: PORT,
  });
});

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎵 API Musique en cours d'exécution sur le port ${PORT}`);
});
