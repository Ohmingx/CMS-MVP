# Nginx and port 5000 (production)

## Why both Nginx and Node?

- **Node (Express + PM2)** listens on **port 5000** (see `ecosystem.config.js` `env_production.PORT` and [ansible/playbooks/templates/nginx-sewdl.conf.j2](../ansible/playbooks/templates/nginx-sewdl.conf.j2)).
- **Nginx** listens on **port 80** and reverse-proxies to `127.0.0.1:5000`.

This avoids binding Node to **port 80**, which would require **root** or extra Linux capabilities. It also gives you a single place to add TLS later (terminate HTTPS on Nginx, proxy HTTP to Node).

## Security group

- Open **80** (and **443** when you add TLS) to users.
- **Do not** open **5000** publicly; keep it loopback-only behind Nginx (default Ansible + Nginx template).

## Disabling Nginx (not recommended)

Set Ansible extra var `sewdl_install_nginx=false` and expose **5000** in the security group only if you accept exposing Node directly (not ideal for production).

## PM2 on reboot

One-time on the app server (as the same user that runs PM2, e.g. `ubuntu`):

```bash
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

The deploy playbook runs `pm2 save` after each deploy; the `pm2 startup` line is still required once per machine so processes return after reboot.
