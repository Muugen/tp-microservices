#!/bin/bash

echo "🎨 Génération du diagramme d'architecture..."

# Vérifier si mermaid-cli est installé
if ! command -v mmdc &> /dev/null; then
    echo "⚠️  mermaid-cli n'est pas installé."
    echo "📦 Installation avec npm:"
    echo "npm install -g @mermaid-js/mermaid-cli"
    echo ""
    echo "🌐 Ou utilisez l'éditeur en ligne:"
    echo "https://mermaid.live/"
    echo ""
    echo "📋 Copiez le contenu du fichier architecture-diagram.md"
    exit 1
fi

# Extraire le code mermaid du fichier markdown
sed -n '/```mermaid/,/```/p' architecture-diagram.md | sed '1d;$d' > temp-diagram.mmd

# Générer l'image
echo "🖼️  Génération de l'image..."
mmdc -i temp-diagram.mmd -o architecture-diagram.png -t neutral -b white

# Nettoyer le fichier temporaire
rm temp-diagram.mmd

if [ -f "architecture-diagram.png" ]; then
    echo "✅ Diagramme généré avec succès : architecture-diagram.png"
else
    echo "❌ Erreur lors de la génération du diagramme"
fi 