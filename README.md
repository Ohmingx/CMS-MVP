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
This project features an optimized EC2 architecture structure. The Node backend statically serves the React frontend when executed in production mode.
1. Make sure your production database is attached to `ecosystem.config.js` or through a root `.env`.
2. Run standard installation on your box: `npm install`
3. Boot the unified application using PM2 to keep your application alive across reboots: 
```bash
pm2 start ecosystem.config.js
```
