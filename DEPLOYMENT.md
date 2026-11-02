# CMS-MVP Deployment

The recommended demonstration deployment uses one Render Node web service for the Vite frontend and Express API, with MongoDB Atlas M0 for persistent application data. The frontend calls the API at `/api`, so it remains same-origin and does not require CORS configuration.

## Free-tier trade-offs

- Render Free web services spin down after 15 minutes without traffic and can take about a minute to start again. Free services have no production SLA, and Render may suspend use after free monthly limits are reached.
- Render's local filesystem is ephemeral. Do not store application data or uploads there.
- MongoDB Atlas M0 provides 512 MB storage and is intended for learning/development workloads; it has no production SLA.
- Menu image upload requires the existing AWS S3 integration to be configured. Without S3, use an existing image URL in menu management; the API does not store uploaded files on Render.
- Configure a spending limit and do not add a payment method unless you intentionally accept possible charges.

Provider details: [Render Free instances](https://render.com/docs/free) and [MongoDB Atlas pricing](https://www.mongodb.com/pricing).

## Deploy with Render Blueprint

1. Create a MongoDB Atlas account and an **M0 Free** cluster. Create a dedicated database user and database, then copy the connection URI. Use a strong unique database password and replace any URI-reserved characters with percent-encoded values.
2. In Atlas Network Access, allow the Render service to connect. Render Free does not provide a fixed outbound IP; if an allow-all entry (`0.0.0.0/0`) is required, use a unique strong database password and never reuse it elsewhere.
3. In Render, choose **New → Blueprint**, connect `Ohmingx/CMS-MVP`, and select the repository's `render.yaml`.
4. Configure the prompted `MONGODB_URI` with the Atlas URI (include a database name such as `canteen_db`). Set `BOOTSTRAP_ADMIN_USERNAME` and `BOOTSTRAP_ADMIN_PASSWORD` to a synthetic demonstration account. Optional staff account variables can provision a staff account as well. Use a VIT-formatted username ending in `@vit.edu.in`; keep all passwords only in Render's environment settings.
5. Render generates `JWT_SECRET`. Do not replace it with a checked-in value. Leave `CORS_ORIGIN` unset because the frontend and API share one origin.
6. Deploy. Wait for the service health check at `/health` to pass, then open the Render URL and test registration/login and role-specific workflows.

The bootstrap user is created on first successful startup if it does not already exist. On subsequent restarts the existing account is left unchanged. To rotate its password, update the user through an approved database administration process; changing the bootstrap environment value does not overwrite existing user passwords.

## Optional image uploads

The image upload endpoint uses AWS S3. To enable it, configure `AWS_REGION`, `S3_BUCKET_NAME`, and AWS credentials using Render's secret environment settings. Grant the AWS identity only the required bucket permissions and configure the bucket's public-read access or a suitable CDN, since the current application stores and returns a public object URL. AWS may incur charges; do not enable this unless you have checked current pricing and limits.

## Local development

```powershell
cd backend
npm ci
Copy-Item .env.example .env
npm run dev
```

Set `MONGODB_URI` in `backend/.env` to a local MongoDB instance or an Atlas URI, and set a non-empty local `JWT_SECRET`. In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Vite runs the frontend and the API defaults to same-origin `/api`; when using the separate Vite dev server, set `VITE_API_URL` to the backend API base URL in a frontend `.env.local` file (for example `http://localhost:5000/api`). The backend permits cross-origin requests during development. Never commit `.env` files.
