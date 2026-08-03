#!/bin/bash
# ============================================================
# GM Helper — Script d'Installation Automatique 1-Click (VPS)
# ============================================================

set -e

echo "🚀 Initialisation de l'installation automatique de GM Helper..."

# 1. Vérification des droits root / sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ce script doit être exécuté avec les privilèges root (sudo ./scripts/setup_vps.sh)"
  exit 1
fi

REAL_USER=${SUDO_USER:-$USER}
echo "👤 Utilisateur cible : $REAL_USER"

# 2. Mise à jour des paquets système
echo "🔄 Mise à jour du système..."
apt update && apt upgrade -y
apt install -y git curl nginx certbot python3-certbot-nginx build-essential ufw

# 3. Installation de Node.js 20 LTS
if ! command -v node &> /dev/null; then
  echo "🟢 Installation de Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  echo "✅ Node.js est déjà installé : $(node -v)"
fi

# 4. Installation de PM2
echo "📦 Installation globale de PM2..."
npm install -g pm2

# 5. Configuration du Pare-feu UFW
echo "🛡️ Configuration du pare-feu UFW (Ports 22, 80, 443)..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 6. Demande d'informations interactives
read -p "🌐 Entrez votre nom de domaine (ex: jdr.votre-domaine.fr) ou appuyez sur Entrée pour utiliser l'IP : " DOMAIN_NAME
read -p "🔑 Entrez une clé secrète JWT aléatoire (ex: ma_cle_secrete_123456) : " JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  echo "🔑 Clé JWT générée automatiquement : $JWT_SECRET"
fi

APP_DIR="/var/www/GM_Helper"

# 7. Si le script n'est pas encore dans /var/www/GM_Helper, le déplacer/cloner
if [ "$(pwd)" != "$APP_DIR" ]; then
  mkdir -p /var/www
  chown -R $REAL_USER:$REAL_USER /var/www
fi

# 8. Configuration du fichier .env du backend
echo "⚙️ Configuration des variables d'environnement (.env)..."
mkdir -p "$APP_DIR/server"

CLIENT_URL="http://${DOMAIN_NAME:-localhost}"
if [ -n "$DOMAIN_NAME" ]; then
  CLIENT_URL="https://${DOMAIN_NAME}"
fi

cat <<EOF > "$APP_DIR/server/.env"
PORT=3000
NODE_ENV=production
DATABASE_URL="file:./dev.db"
JWT_SECRET=${JWT_SECRET}
CLIENT_URL=${CLIENT_URL}
UPLOAD_DIR=./uploads
EOF

chown -R $REAL_USER:$REAL_USER "$APP_DIR"

# 9. Lancement du déploiement initial en tant qu'utilisateur réel
echo "🏗️ Lancement du déploiement initial..."
sudo -u $REAL_USER bash -c "cd $APP_DIR && chmod +x scripts/deploy.sh && ./scripts/deploy.sh"

# 10. Configuration PM2 Autostart
echo "🔄 Configuration du démarrage automatique PM2..."
sudo -u $REAL_USER bash -c "cd $APP_DIR && pm2 start ecosystem.config.cjs && pm2 save"
env PATH=$PATH:/usr/bin pm2 startup systemd -u $REAL_USER --hp /home/$REAL_USER || true

# 11. Configuration Nginx
if [ -n "$DOMAIN_NAME" ]; then
  echo "🌐 Configuration de Nginx pour $DOMAIN_NAME..."
  cat <<EOF > /etc/nginx/sites-available/gm-helper.conf
server {
    listen 80;
    server_name ${DOMAIN_NAME};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
EOF

  ln -sf /etc/nginx/sites-available/gm-helper.conf /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default || true
  nginx -t
  systemctl reload nginx

  echo "🔒 Génération du certificat SSL avec Certbot..."
  certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email || echo "⚠️ Certbot n'a pas pu générer le SSL automatiquement (Vérifiez votre DNS)."
fi

# 12. Ajout de la routine Cron
echo "⏰ Ajout de la routine de mise à jour quotidienne à 4h du matin..."
CRON_JOB="0 4 * * * $APP_DIR/scripts/deploy.sh >> $APP_DIR/logs/cron-deploy.log 2>&1"
(crontab -u $REAL_USER -l 2>/dev/null | grep -v "deploy.sh" ; echo "$CRON_JOB") | crontab -u $REAL_USER -

echo "============================================================"
echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "============================================================"
echo "🌐 Application accessible sur : ${CLIENT_URL}"
echo "📊 Statut PM2 : sudo -u $REAL_USER pm2 status"
echo "============================================================"
