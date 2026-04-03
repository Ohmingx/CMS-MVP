# CMS-MVP

MERN canteen app monorepo (`frontend` + `backend`) with a simplified EC2-first deployment.

## Local development

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

## Build frontend bundle for production

This project now deploys using a prebuilt frontend bundle committed under `backend/public`.

```bash
npm run bundle:frontend
```

That command:
1. Builds `frontend/dist`
2. Copies the build into `backend/public`

Commit these changes before deploying.

## EC2 deployment (single instance, no Jenkins/Ansible)

Target instance: `13.201.44.89`

### One-time setup on EC2

```bash
git clone https://github.com/Ohmingx/CMS-MVP.git
cd CMS-MVP
chmod +x scripts/ec2-setup.sh scripts/ec2-deploy.sh
./scripts/ec2-setup.sh
```

### Every deploy

```bash
cd ~/CMS-MVP
./scripts/ec2-deploy.sh
```

The deploy script will:
- pull latest `main`
- create `.env` if missing
- install **backend-only** dependencies
- start/restart PM2 app
- run health check on `127.0.0.1:5000/health`

## Required AWS Security Group rules

- Inbound `22` from your IP
- Inbound `5000` from `0.0.0.0/0` (or restricted source)

## Production URL

- `http://13.201.44.89:5000`
