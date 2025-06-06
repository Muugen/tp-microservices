#!/bin/bash

echo "🧪 Test des microservices"
echo "=========================="

GATEWAY_URL="http://localhost:8080"

echo ""
echo "🔍 Test de l'API Gateway..."
curl -s "$GATEWAY_URL/health" | head -c 100
echo ""

echo ""
echo "🎵 Test API Musique via Gateway..."
echo "📋 Liste des musiques:"
curl -s "$GATEWAY_URL/api/musiques" | head -c 200
echo ""

echo ""
echo "🎲 Test API Jeux via Gateway..."
echo "📋 Liste des jeux:"
curl -s "$GATEWAY_URL/api/jeux" | head -c 200
echo ""

echo ""
echo "🎯 Test nouvelle route musique aléatoire:"
curl -s "$GATEWAY_URL/api/musiques/random" | head -c 200
echo ""

echo ""
echo "📊 Test état de santé des services:"
echo "Gateway:"
curl -s "$GATEWAY_URL/health" | head -c 100
echo ""
echo "API Musique (via Gateway):"
curl -s "$GATEWAY_URL/api/health/musique" | head -c 100
echo ""
echo "API Jeux (via Gateway):"
curl -s "$GATEWAY_URL/api/health/jeux" | head -c 100
echo ""

echo ""
echo "✅ Tests terminés !" 