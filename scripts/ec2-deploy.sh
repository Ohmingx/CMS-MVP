#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/CMS-MVP}"
APP_URL="${APP_URL:-http://13.201.44.89:5000}"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Repo not found at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

echo "[1/7] Pulling latest code..."
git pull origin main

echo "[2/7] Creating runtime .env if missing..."
if [[ ! -f .env ]]; then
  cp .env.example .env
fi

if ! grep -q '^MONGODB_URI=' .env; then
  echo 'MONGODB_URI=mongodb://127.0.0.1:27017/canteen_db' >> .env
fi
if ! grep -q '^JWT_SECRET=' .env; then
  echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
fi
if ! grep -q '^PORT=' .env; then
  echo 'PORT=5000' >> .env
fi
if ! grep -q '^CORS_ORIGIN=' .env; then
  echo "CORS_ORIGIN=$APP_URL" >> .env
fi

echo "[3/7] Installing backend dependencies only..."
npm install --workspace=backend --omit=dev

echo "[4/7] Verifying frontend production bundle exists..."
if [[ ! -f backend/public/index.html ]]; then
  echo "backend/public/index.html not found."
  echo "Build locally and commit with: npm run bundle:frontend"
  exit 1
fi

echo "[5/7] Starting app with PM2..."
pm2 delete sewdl-backend >/dev/null 2>&1 || true
pm2 start ecosystem.config.js --env production
pm2 save

echo "[6/7] Health check..."
sleep 2
curl -fsS http://127.0.0.1:5000/health

echo
echo "[7/7] Deploy successful."
echo "Open: $APP_URL"
