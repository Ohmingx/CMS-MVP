# CMS-MVP (Canteen Management System)

An optimized, scalable, and responsive Fullstack architecture constructed using the **MERN** *(MongoDB, Express, React, Node.js)* stack.

## Architecture Highlights
This application is formatted as a strict two-folder monolith (`/frontend` and `/backend`). It is explicitly engineered for simple, bare-metal Cloud deployment (e.g. AWS EC2).

## Component Stack
- **Frontend**: React 18, Vite Bundler, TailwindCSS, Zustand State Management, React Router DOM.
- **Backend**: Node.js, Express, MongoDB/Mongoose OS, JWT Auth securely configured with Helmet & Cors.
- **Hosting Utilities**: PM2 ecosystem support for detached, background production execution.

## Feature Breakdown
* **Role-based Authentication**: JWT integration maps UI portals independently to `admin`, `staff`, or `student` dashboards securely.
* **Menu Management**: Admins have full control over item instantiation and availability metrics.
* **Active Queue Ordering**: Students select orders which route directly to Staff portals mapped tightly with feedback cycles. 
* **Analytic Logging**: Revenue generators and metric analysis dashboard endpoints available exclusively for admin tracking.

## Development

Currently, the frontend and backend are maintained as completely decoupled services. You will need to install dependencies in both folders individually:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
Please refer closely to the `DEPLOYMENT.md` guide for precise steps on how to deploy this manually to a bare-metal Ubuntu EC2 environment without needing Docker, Jenkins, or Ansible.
