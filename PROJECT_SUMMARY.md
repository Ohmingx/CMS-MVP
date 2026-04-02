# CMS-MVP (Canteen Management System)

An optimized, scalable, and responsive Fullstack architecture constructed using the **MERN** *(MongoDB, Express, React, Node.js)* stack.

## Architecture Highlights
This application is formatted as a Monorepo using NPM Workspaces. It is explicitly engineered for simple Cloud deployment (e.g. AWS EC2).
* **Unified Environment**: In development (`npm run dev`), the `backend` and `frontend` function as decoupled services. 
* **Production Static Serving**: In production mode (`NODE_ENV=production`), the Node.js backend seamlessly catches and serves the generated static assets of the Vite/React frontend build. This permits users to host an entire application ecosystem via a single Node PM2 process.

## Component Stack
- **Frontend**: React 18, Vite Bundler, TailwindCSS, Zustand State Management, React Router DOM.
- **Backend**: Node.js, Express, MongoDB/Mongoose OS, JWT Auth securely configured with Helmet & Cors.
- **Hosting Utilities**: Integrated PM2 Ecosystem config and preconfigured root-level `.env.example`.

## Feature Breakdown
* **Role-based Authentication**: JWT integration maps UI portals independently to `admin`, `staff`, or `student` dashboards securely.
* **Menu Management**: Admins have full control over item instantiation and availability metrics.
* **Active Queue Ordering**: Students select orders which route directly to Staff portals mapped tightly with feedback cycles. 
* **Analytic Logging**: Revenue generators and metric analysis dashboard endpoints available exclusively for admin tracking.
