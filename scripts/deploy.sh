#!/bin/bash
# ============================================================
# GM Helper — Script de Déploiement Automatique pour VPS
# ============================================================

set -e # Arrêter en cas d'erreur

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "🚀 Début du déploiement GM Helper dans : $APP_DIR"
cd "$APP_DIR"

# 1. Récupération du code Git
echo "📥 Récupération des dernières modifications sur Git..."
git pull origin main

# 2. Mise à jour du Backend
echo "📦 Installation des dépendances Backend..."
cd "$APP_DIR/server"
npm ci --production=false

echo "🗄️ Application des migrations Prisma & Génération du client..."
npx prisma generate
npx prisma migrate deploy

# 3. Compilation du Frontend
echo "🏗️ Compilation du Frontend React/Vite..."
cd "$APP_DIR/client"
npm ci
npm run build

# 4. Redémarrage du serveur avec PM2
echo "🔄 Redémarrage du serveur via PM2..."
cd "$APP_DIR"
mkdir -p logs
npx pm2 reload ecosystem.config.cjs || npx pm2 start ecosystem.config.cjs

echo "✅ Déploiement terminé avec succès ! (http://localhost:3000)"
