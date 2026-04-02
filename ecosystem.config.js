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
        PORT: 80,
      }
    }
  ]
};
