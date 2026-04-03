#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] Installing base packages..."
sudo apt update
sudo apt install -y ca-certificates curl gnupg git

echo "[2/5] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

echo "[3/5] Installing PM2..."
sudo npm install -g pm2

echo "[4/5] Installing MongoDB via Docker (most reliable on Ubuntu)..."
if ! command -v docker >/dev/null 2>&1; then
  sudo apt install -y docker.io
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER" || true
fi

if ! sudo docker ps -a --format '{{.Names}}' | grep -q '^sewdl-mongo$'; then
  sudo docker run -d \
    --name sewdl-mongo \
    --restart unless-stopped \
    -p 127.0.0.1:27017:27017 \
    mongo:7
else
  sudo docker start sewdl-mongo >/dev/null 2>&1 || true
fi

echo "[5/5] Setup complete."
echo "Next: run ./scripts/ec2-deploy.sh"
