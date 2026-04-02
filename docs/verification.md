# Post-deploy verification

After Ansible finishes on the **app** EC2 instance, verify the stack from the server and from a browser.

## 1. SSH into the app instance

```bash
ssh -i ~/.ssh/your_key.pem ubuntu@APP_PUBLIC_IP
```

## 2. Process and HTTP checks

```bash
# PM2 shows sewdl-backend
pm2 status

# API health (Node listens on 5000; Nginx proxies :80 -> :5000)
curl -sS http://127.0.0.1:5000/health
curl -sS http://127.0.0.1/health

# MongoDB (local only; should not be exposed publicly)
sudo systemctl status mongod
```

Expected: `GET /health` returns JSON like `{"status":"ok"}`.

## 3. Browser

- Open `http://APP_PUBLIC_IP/` (or your domain).
- Log in / register flows should call `/api/...` successfully.
- If the UI loads but API calls fail with CORS errors, update `SEWDL_CORS_ORIGIN` in Jenkins (or `-e sewdl_cors_origin=...` for Ansible) to match the exact URL users type in the address bar (scheme + host + port).

## 4. Jenkins build

- Confirm the pipeline **Build** stage passes (`npm ci`, frontend build).
- Confirm **Deploy** runs `ansible/playbooks/deploy.yml` without errors.

See also [nginx-and-port.md](nginx-and-port.md) for how Nginx and PM2 ports relate.
