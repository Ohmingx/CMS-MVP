# Bare-Metal EC2 Deployment Guide (Ubuntu)

This guide provides exactly what you need to deploy the two-folder frontend/backend monolith on a single Ubuntu instance manually, without Docker or complex pipelines.

## 1. Initial Server Setup (Installing Node & Nginx)

Connect to your Ubuntu EC2 instance, then run these commands to install Nginx and Node.js:

```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Nginx
sudo apt install -y nginx

# Install Node.js (via NodeSource for v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node -v
npm -v
nginx -v

# Install PM2 globally to keep the backend running forever
sudo npm install -g pm2
```

## 2. Clone & Transfer the Project

```bash
# Navigate to home
cd ~

# Clone your repository (replace with your actual git URL)
git clone https://github.com/Ohmingx/CMS-MVP.git

# Enter the project root
cd CMS-MVP
```

## 3. Install Dependencies & Build Frontend

Because this is a pure two-folder architecture, you must initialize both independently.

### Backend Initialization
```bash
cd backend
npm install

# Your .env should be populated with production values
# If not, create it manually:
# cp .env.example .env
# nano .env (Make sure PORT=5000 and MONGODB_URI is your Atlas URI)
```

### Frontend Initialization & Build
```bash
cd ../frontend
npm install

# Build the production static files
npm run build
```
Once this finishes, you will see a `dist/` directory inside `frontend`. This contains your finalized static UI.

## 4. Run the Backend Forever

Once backend dependencies are installed and the `.env` is correct, use PM2 to start it.

```bash
# Ensure you are still in the backend directory
cd ../backend

# Start the Node.js backend using PM2
pm2 start ecosystem.config.js

# Ensure PM2 resurrects your app on a server reboot
pm2 startup
# (Run the command that PM2 output prompts you to execute)
pm2 save
```

## 5. Configure Nginx

Nginx will serve the `frontend/dist` directory directly for high performance, and proxy any network calls starting with `/api` to the running PM2 backend on port 5000.

1. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/cms_mvp
   ```

2. Paste the following configuration Block:
   ```nginx
   server {
       listen 80;
       server_name _; # Change to domain name if you have one

       # 1) Serve the frontend build
       # Replace 'ubuntu' with your user name if different!
       root /home/ubuntu/CMS-MVP/frontend/dist;
       index index.html index.htm;

       # Standard single-page application fallback routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 2) Reverse Proxy to the Backend for API calls
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the config and restart Nginx:
   ```bash
   # Remove default Nginx config
   sudo rm /etc/nginx/sites-enabled/default
   
   # Enable our new site
   sudo ln -s /etc/nginx/sites-available/cms_mvp /etc/nginx/sites-enabled/
   
   # Check syntax
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

Your app is now fully deployed! Visit your instance's public IP address in the browser.
