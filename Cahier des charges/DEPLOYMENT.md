# 🚀 Guide Ultime & Complet de Déploiement VPS 24/7 — GM Helper

Ce guide vous accompagne pas-à-pas dans l'installation, la sécurisation, la configuration du domaine et l'automatisation de votre application **GM Helper** sur un serveur dédié virtuel (VPS Linux).

---

## 📑 Sommaire
1. [🏛️ Architecture & Schéma de Fonctionnement](#-1-architecture--schéma-de-fonctionnement)
2. [☁️ Étape 1 : Choix & Configuration du VPS (Focus Oracle Cloud Free / Ubuntu)](#-étape-1--choix--configuration-du-vps)
3. [🌐 Étape 2 : Nom de Domaine & Configuration DNS](#-étape-2--nom-de-domaine--configuration-dns)
4. [⚙️ Étape 3 : Préparation de l'Environnement Linux (Node.js 20, Git, Nginx, PM2)](#-étape-3--préparation-de-lenvironnement-linux)
5. [📦 Étape 4 : Déploiement & Configuration de l'Application](#-étape-4--déploiement--configuration-de-lapplication)
6. [🔄 Étape 5 : Gestion de la Persistance 24/7 avec PM2](#-étape-5--gestion-de-la-persistance-247-avec-pm2)
7. [🔒 Étape 6 : Configuration Nginx, WebSockets & SSL HTTPS (Certbot)](#-étape-6--configuration-nginx-websockets--ssl-https)
8. [⏰ Étape 7 : Automation Git Quotidienne (Cron & Webhook)](#-étape-7--automation-git-quotidienne)
9. [💾 Étape 8 : Stratégie de Sauvegarde (SQLite & Dossier Uploads)](#-étape-8--stratégie-de-sauvegarde)
10. [🛠️ Étape 9 : Guide de Dépannage & Commandes Utiles](#-étape-9--guide-de-dépannage--commandes-utiles)

---

## 🏛️ 1. Architecture & Schéma de Fonctionnement

Sur votre VPS Linux, l'application fonctionne selon le schéma suivant :

```
                                [ Joueurs / MJ (Navigateurs Web) ]
                                                │
                                                ▼  (Port 443 - HTTPS & WSS)
                                     ┌─────────────────────┐
                                     │     Nginx Proxy     │
                                     └──────────┬──────────┘
                                                │ (Proxy local 127.0.0.1:3000)
                        ┌───────────────────────┴───────────────────────┐
                        ▼                                               ▼
     ┌─────────────────────────────────────┐         ┌─────────────────────────────────────┐
     │   Fichiers Statiques (React/Vite)   │         │    API Node.js & Socket.io (PM2)     │
     │      `/client/dist` (HTML/JS/CSS)   │         │       (Gestion dés, combat, etc.)   │
     └─────────────────────────────────────┘         └──────────────────┬──────────────────┘
                                                                        │
                                                     ┌──────────────────┴──────────────────┐
                                                     ▼                                     ▼
                                          ┌────────────────────┐                ┌────────────────────┐
                                          │   Base SQLite      │                │ Dossier `/uploads` │
                                          │  `server/dev.db`   │                │   (Cartes & PNJ)   │
                                          └────────────────────┘                └────────────────────┘
```

---

## ☁️ Étape 1 : Choix & Configuration du VPS

### A. Hébergeurs Recommandés
* **Oracle Cloud Free Tier (RECOMMANDÉ) :** Offre 1 VPS ARM (Ampere) avec jusqu'à 4 vCPU et 24 Go de RAM **100% gratuit à vie**.
* **Hetzner / OVH / DigitalOcean :** Un petit VPS Linux Ubuntu à 3~5 € / mois convient parfaitement.

### B. Configuration des Port Réseau (Pare-feu)
Pour que vos joueurs puissent accéder au serveur, vous devez ouvrir les ports **80 (HTTP)**, **443 (HTTPS)** et **22 (SSH)**.

#### 1. Sur Oracle Cloud (Security List) :
Dans le Dashboard Oracle Cloud ➔ *Networking* ➔ *Virtual Cloud Networks* ➔ Sélectionnez votre VCN ➔ *Security Lists* ➔ *Default Security List* ➔ **Add Ingress Rules** :
* **Source CIDR :** `0.0.0.0/0`
* **IP Protocol :** `TCP`
* **Destination Port Range :** `80,443`

#### 2. Sur le VPS Linux (Pare-feu système iptables/ufw) :
Exécutez dans le terminal de votre VPS :
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🌐 Étape 2 : Nom de Domaine & Configuration DNS

Il est vivement recommandé d'utiliser un nom de domaine (ex: `jdr-xyiaine.fr` ou un sous-domaine `gm.votre-domaine.com`) pour activer le HTTPS.

1. Rendez-vous chez votre registrar (OVH, Namecheap, Cloudflare, DuckDNS, etc.).
2. Ajoutez deux enregistrements DNS de type **A** :
   * **Nom / Hôte :** `@` ➔ **Valeur :** `IP_PUBLIQUE_DE_VOTRE_VPS`
   * **Nom / Hôte :** `www` ➔ **Valeur :** `IP_PUBLIQUE_DE_VOTRE_VPS`
3. Patientez quelques minutes pour la propagation DNS (vous pouvez tester avec `ping votre-domaine.fr`).

---

## ⚙️ Étape 3 : Préparation de l'Environnement Linux

Connectez-vous en SSH à votre serveur :
```bash
ssh ubuntu@IP_DE_VOTRE_VPS
```

### 1. Mettre à jour le système
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer les outils de base (Git, Curl, Nginx, Certbot)
```bash
sudo apt install -y git curl nginx certbot python3-certbot-nginx build-essential
```

### 3. Installer Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Vérifiez l'installation :
```bash
node -v # Doit afficher v20.x.x
npm -v
```

### 4. Installer PM2 globalement
```bash
sudo npm install -g pm2
```

---

## 📦 Étape 4 : Déploiement & Configuration de l'Application

### 1. Préparer le dossier d'installation
```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
```

### 2. Cloner le projet Git
```bash
git clone https://github.com/VOTRE_PSEUDO/GM_Helper.git
cd GM_Helper
```
*(Si votre dépôt est privé, configurez une clé SSH GitHub via `ssh-keygen` et ajoutez la clé publique `.pub` dans vos paramètres GitHub).*

### 3. Configurer les variables d'environnement (`.env`)
Créez le fichier d'environnement du serveur :
```bash
cp server/.env.example server/.env
nano server/.env
```

Modifiez le fichier pour correspondre à votre production :
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="file:./dev.db"
JWT_SECRET=mettez_ici_une_chaine_tres_longue_et_secrete_123456
CLIENT_URL=https://votre-domaine.fr
UPLOAD_DIR=./uploads
```
*(Pour quitter nano : `Ctrl+O`, `Entrée`, puis `Ctrl+X`).*

### 4. Lancer le premier déploiement
Rendez le script d'automatisation exécutable et lancez-le :
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```
Le script va :
- Récupérer le code Git
- Installer les packages Node.js
- Générer Prisma et exécuter les migrations SQLite
- Compiler le frontend React (`client/dist`)
- Démarrer l'application sous PM2.

---

## 🔄 Étape 5 : Gestion de la Persistance 24/7 avec PM2

Pour garantir que l'application se relance automatiquement si le VPS redémarre (mise à jour serveur, coupure de courant, etc.) :

1. Démarrez l'application avec PM2 :
```bash
cd /var/www/GM_Helper
pm2 start ecosystem.config.cjs
```

2. Configurez le démarrage automatique au boot du système :
```bash
pm2 startup
```
*(Copiez-collez la commande `sudo env PATH=...` affichée à l'écran par PM2).*

3. Sauvegardez la liste des processus actuels :
```bash
pm2 save
```

4. Verifiez le statut :
```bash
pm2 status
```

---

## 🔒 Étape 6 : Configuration Nginx, WebSockets & SSL HTTPS

### 1. Copier et éditer la configuration Nginx
```bash
sudo cp scripts/nginx.conf.example /etc/nginx/sites-available/gm-helper.conf
sudo nano /etc/nginx/sites-available/gm-helper.conf
```
Remplacez toutes les occurrences de `votre-domaine.fr` par votre vrai nom de domaine.

### 2. Activer le site Nginx
```bash
sudo ln -s /etc/nginx/sites-available/gm-helper.conf /etc/nginx/sites-enabled/
sudo nginx -t # Doit afficher 'syntax is ok'
sudo systemctl reload nginx
```

### 3. Obtenir un certificat SSL HTTPS Gratuit (Certbot)
```bash
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr
```
Entrez votre adresse email et acceptez les conditions. Certbot va automatiquement modifier Nginx pour activer le HTTPS sécurisé !

Vérifiez que le renouvellement automatique est fonctionnel :
```bash
sudo systemctl status certbot.timer
```

---

## ⏰ Étape 7 : Automation Git Quotidienne

### Méthode A : Tâche Cron automatique quotidienne (4h du matin)

Ouvrez la table cron de l'utilisateur :
```bash
crontab -e
```

Ajoutez la ligne suivante tout en bas :
```cron
# Mise à jour automatique de GM Helper chaque nuit à 04:00 AM
0 4 * * * /var/www/GM_Helper/scripts/deploy.sh >> /var/www/GM_Helper/logs/cron-deploy.log 2>&1
```

### Méthode B (Alternative) : Déploiement instantané au `git push` via Webhook
Si vous préférez que le serveur se mette à jour immédiatement quand vous poussez du code depuis votre PC, vous pouvez installer `webhook` sur Linux :
```bash
sudo apt install webhook
```
Il suffit d'écouter sur un port secret et de renseigner l'URL dans les paramètres Webhook de votre dépôt GitHub.

---

## 💾 Étape 8 : Stratégie de Sauvegarde

Votre base de données SQLite se trouve dans `server/prisma/dev.db` et vos images dans `server/uploads/`.

Pour éviter toute perte de données lors de vos campagnes de JdR, créez un script de backup rapide `/home/ubuntu/backup_gm.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
mkdir -p "$BACKUP_DIR"

# Copie de la base SQLite et des images
cp /var/www/GM_Helper/server/prisma/dev.db "$BACKUP_DIR/dev.db_$DATE"
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C /var/www/GM_Helper/server uploads

# Ne garder que les 14 dernières sauvegardes
ls -dt $BACKUP_DIR/* | tail -n +15 | xargs rm -rf 2>/dev/null || true

echo "✅ Sauvegarde effectuée : $DATE"
```

Rendez-le exécutable et ajoutez-le à `crontab -e` (tous les jours à 03:30 AM) :
```cron
30 3 * * * /home/ubuntu/backup_gm.sh >> /home/ubuntu/backup.log 2>&1
```

---

## 🛠️ Étape 9 : Guide de Dépannage & Commandes Utiles

### 📊 Commandes de suivi du serveur
* **Voir les logs de l'application en direct :**
  ```bash
  pm2 logs gm-helper-server
  ```
* **Voir les logs Nginx (Erreurs Web / SSL) :**
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
* **Relancer manuellement le serveur :**
  ```bash
  pm2 restart gm-helper-server
  ```
* **Forcer un déploiement complet :**
  ```bash
  /var/www/GM_Helper/scripts/deploy.sh
  ```

---

### ❓ Résolution des Erreurs Courantes

#### 1. Erreur WebSockets / Socket.io ne se connecte pas
* **Cause :** Nginx ne transmet pas les headers d'upgrade WebSockets.
* **Solution :** Vérifiez que le bloc `location /socket.io/` dans `/etc/nginx/sites-available/gm-helper.conf` contient bien `proxy_set_header Upgrade $http_upgrade;` et `proxy_set_header Connection "Upgrade";`.

#### 2. Erreur 413 Payload Too Large lors de l'envoi d'une carte HD
* **Cause :** Nginx bloque les fichiers trop volumineux par défaut (1 Mo).
* **Solution :** Vérifiez la présence de `client_max_body_size 50M;` dans le fichier de config Nginx.

#### 3. Problème de permissions lors de l'upload d'images
* **Cause :** Le dossier `server/uploads` n'appartient pas à l'utilisateur exécutant Node.js.
* **Solution :** 
  ```bash
  sudo chown -R $USER:$USER /var/www/GM_Helper/server/uploads
  chmod -R 755 /var/www/GM_Helper/server/uploads
  ```

#### 4. Erreur "Database is locked" (SQLite)
* **Cause :** Plusieurs processus tentent d'écrire en même temps dans SQLite.
* **Solution :** Assurez-vous d'avoir une seule instance tournant dans PM2 (`instances: 1` dans `ecosystem.config.cjs`).

---

🎉 **Votre serveur GM Helper est paré pour la production 24h/24 et 7j/7 ! Bon jeu à vous et à vos joueurs !** 🎲
