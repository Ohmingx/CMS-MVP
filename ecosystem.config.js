module.exports = {
  apps: [
    {
      name: "sewdl-backend",
      script: "npm",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production",
        // Bind on 5000 so PM2 does not require root; use Nginx on :80 → :5000 (see ansible/templates)
        PORT: 5000,
      }
    }
  ]
};
