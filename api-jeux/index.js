const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données en mémoire
let jeux = [
  {
    id: 1,
    nom: "Monopoly",
    editeur: "Hasbro",
    nbJoueurs: "2-8",
    duree: 180,
    age: 8,
  },
  {
    id: 2,
    nom: "Scrabble",
    editeur: "Mattel",
    nbJoueurs: "2-4",
    duree: 90,
    age: 10,
  },
  {
    id: 3,
    nom: "Catan",
    editeur: "Kosmos",
    nbJoueurs: "3-4",
    duree: 75,
    age: 10,
  },
  {
    id: 4,
    nom: "Azul",
    editeur: "Plan B Games",
    nbJoueurs: "2-4",
    duree: 45,
    age: 8,
  },
];
let nextId = 5;

// Routes

// GET /jeux - Lister tous les jeux
app.get("/jeux", (req, res) => {
  res.json({
    success: true,
    data: jeux,
    message: "Liste des jeux récupérée avec succès",
  });
});

// GET /jeux/:id - Récupérer un jeu par ID
app.get("/jeux/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const jeu = jeux.find((j) => j.id === id);

  if (!jeu) {
    return res.status(404).json({
      success: false,
      message: "Jeu non trouvé",
    });
  }

  res.json({
    success: true,
    data: jeu,
    message: "Jeu récupéré avec succès",
  });
});

// POST /jeux - Ajouter un nouveau jeu
app.post("/jeux", (req, res) => {
  const { nom, editeur, nbJoueurs, duree, age } = req.body;

  if (!nom || !editeur) {
    return res.status(400).json({
      success: false,
      message: "Le nom et l'éditeur sont obligatoires",
    });
  }

  const nouveauJeu = {
    id: nextId++,
    nom,
    editeur,
    nbJoueurs: nbJoueurs || "Non spécifié",
    duree: duree || null,
    age: age || null,
  };

  jeux.push(nouveauJeu);

  res.status(201).json({
    success: true,
    data: nouveauJeu,
    message: "Jeu ajouté avec succès",
  });
});

// PUT /jeux/:id - Modifier un jeu
app.put("/jeux/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nom, editeur, nbJoueurs, duree, age } = req.body;

  const index = jeux.findIndex((j) => j.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Jeu non trouvé",
    });
  }

  jeux[index] = {
    ...jeux[index],
    nom: nom || jeux[index].nom,
    editeur: editeur || jeux[index].editeur,
    nbJoueurs: nbJoueurs || jeux[index].nbJoueurs,
    duree: duree !== undefined ? duree : jeux[index].duree,
    age: age !== undefined ? age : jeux[index].age,
  };

  res.json({
    success: true,
    data: jeux[index],
    message: "Jeu modifié avec succès",
  });
});

// DELETE /jeux/:id - Supprimer un jeu
app.delete("/jeux/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = jeux.findIndex((j) => j.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Jeu non trouvé",
    });
  }

  const jeuSupprime = jeux.splice(index, 1)[0];

  res.json({
    success: true,
    data: jeuSupprime,
    message: "Jeu supprimé avec succès",
  });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "API Jeux",
    status: "En fonctionnement",
    port: PORT,
  });
});

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎲 API Jeux en cours d'exécution sur le port ${PORT}`);
});
