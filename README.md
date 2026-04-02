# CMS-MVP

This is the central Monorepo for the Canteen Management System (CMS-MVP). 

## NPM Workspaces
You can easily navigate and install the dependencies for both the frontend and backend of this project simultaneously!
Simply run:
```bash
npm install
```
This single command automatically resolves packages for both projects and constructs your Vite build.

## Starting the Project Locally (Dev Mode)
To launch the respective developer cycles where the React client hits the open API routes on localhost:
1. Copy `.env.example` to `.env` inside `/backend` and structure your MongoDB URI.
2. Provide terminal A: `npm run dev:backend`
3. Provide terminal B: `npm run dev:frontend`

## Deploying to AWS EC2 (Production Mode)
The Node backend serves the built React app when `NODE_ENV=production` (see `backend/src/server.js`).

### Docs (recommended order)
1. **[docs/aws-ec2-setup.md](docs/aws-ec2-setup.md)** — EC2 instances, Security Groups (Jenkins ↔ app SSH, HTTP on app).
2. **[docs/jenkins-setup.md](docs/jenkins-setup.md)** — Install Jenkins + Ansible on the Jenkins box; SSH key + credentials.
3. **[ansible/README.md](ansible/README.md)** — Run the deploy playbook manually (optional).
4. **[docs/verification.md](docs/verification.md)** — Health checks after deploy.
5. **[docs/nginx-and-port.md](docs/nginx-and-port.md)** — Nginx on `:80` → Node/PM2 on `:5000`.

### Jenkins CI/CD
- Edit `ansible/inventory/production.ini` with your **app** host IP and SSH user.
- Create Jenkins credentials `sewdl-jwt-secret` and `sewdl-ansible-ssh` (see `docs/jenkins-setup.md`).
- Create a **Pipeline** job from SCM using the root `Jenkinsfile`; set parameter `SEWDL_CORS_ORIGIN` to your public app URL.

### Manual run on a server (no Jenkins)
1. Copy `.env.example` to repo root `.env` and set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN` as needed.
2. `npm install` (builds the frontend via `postinstall`).
3. `pm2 start ecosystem.config.js --env production`

For a full automated install (MongoDB + Node + Nginx + PM2), use **Ansible** as above.
