# CMS-MVP

This is the central Monorepo for the Canteen Management System (CMS-MVP). 

## NPM Workspaces
You can easily navigate and install the dependencies for both the frontend and backend of this project simultaneously!
Simply run:
```bash
npm install
```
This installs dependencies for both `frontend` and `backend`. To build the frontend bundle:
```bash
npm run build:frontend
```

## Starting the Project Locally (Dev Mode)
To launch the respective developer cycles where the React client hits the open API routes on localhost:
1. Copy `.env.example` to `.env` inside `/backend` and structure your MongoDB URI.
2. Provide terminal A: `npm run dev:backend`
3. Provide terminal B: `npm run dev:frontend`

## Deploying to AWS EC2 (Production Mode, simple)
The Node backend serves the built React app when `NODE_ENV=production` (see `backend/src/server.js`).

### 1. EC2 + Security Group
- Launch an **Ubuntu 22.04** EC2 instance.
- In the security group, allow:
  - **SSH (22)** from your IP.
  - **HTTP (5000)** from `0.0.0.0/0` (or from your IP only).

### 2. Install system dependencies (on EC2)
SSH into the instance, then:
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# (Optional) MongoDB if you are not using Atlas
sudo apt install -y mongodb
sudo systemctl enable --now mongodb
```

### 3. Clone the repo and set env
```bash
git clone https://github.com/Ohmingx/CMS-MVP.git
cd CMS-MVP

cp .env.example .env
```
Edit `.env` and set at least:
- `MONGODB_URI` (e.g. `mongodb://127.0.0.1:27017/canteen_db` or your Atlas URI)
- `JWT_SECRET` (long random string)
- `PORT=5000`
- `CORS_ORIGIN=http://YOUR_EC2_PUBLIC_IP:5000`

### 4. Install deps and build frontend
```bash
npm install
npm run build:frontend
```

### 5. Run in production
Install PM2 and start the app:
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
```

Now your app is reachable at:
- `http://YOUR_EC2_PUBLIC_IP:5000`
