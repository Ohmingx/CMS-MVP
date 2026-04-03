## Ansible deploy (sewdl)

### Layout
- `inventory/production.ini` — set `ansible_host` to your **app** EC2 public IP and `ansible_user` (e.g. `ubuntu`).
- `inventory/group_vars/sewdl_app.yml` — defaults (`sewdl_git_repo`, `sewdl_cors_origin`, etc.).
- `playbooks/deploy.yml` — installs MongoDB, Node 20, PM2, Nginx; clones repo to `/opt/sewdl`; runs `npm ci`; starts PM2 with `ecosystem.config.js` in production.

### Manual run (from repo root)
```bash
cd ansible
ansible-playbook -i inventory/production.ini playbooks/deploy.yml \
  --private-key ~/.ssh/sewdl_app \
  -e sewdl_jwt_secret='YOUR_LONG_SECRET' \
  -e sewdl_git_repo='https://github.com/YOUR_ORG/sewdl.git' \
  -e sewdl_cors_origin='http://13.201.44.89'
```

### Jenkins
Use the root `Jenkinsfile` and credentials documented in `docs/jenkins-setup.md`.
