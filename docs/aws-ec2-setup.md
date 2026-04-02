# AWS EC2 setup (Jenkins + app)

Use **two** EC2 instances on **Ubuntu 22.04 LTS** (recommended):

| Instance | Role | Notes |
|----------|------|--------|
| `jenkins` | CI server | Runs Jenkins + Ansible; connects to `app` over SSH for deploys |
| `app` | Runtime | Node (PM2), MongoDB, Nginx (optional but recommended); serves the MERN app |

## 1. VPC and networking

- Place both instances in the same VPC (or ensure Jenkins can reach `app` on TCP 22).
- Assign **public IPs** if you SSH from your laptop to Jenkins, or use a bastion/VPN.

## 2. Security groups

### Jenkins instance (`jenkins-sg`)

| Direction | Port | Source | Purpose |
|-----------|------|--------|---------|
| Inbound | 22 | Your IP (or VPN CIDR) | SSH administration |
| Inbound | 8080 | Your IP (or VPN CIDR) | Jenkins web UI |
| Outbound | All | 0.0.0.0/0 | Git clone, package installs, Ansible SSH to `app` |

### App instance (`app-sg`)

| Direction | Port | Source | Purpose |
|-----------|------|--------|---------|
| Inbound | 22 | **Security group ID of `jenkins-sg`** | Ansible / deploy SSH only from Jenkins |
| Inbound | 80 | 0.0.0.0/0 (or your office/VPN) | HTTP (Nginx → Node on 5000) |
| Inbound | 443 | 0.0.0.0/0 (optional) | HTTPS after you add TLS |
| Outbound | All | 0.0.0.0/0 | Updates, optional external APIs |

**Do not** expose MongoDB (27017) to the internet; keep it localhost-only on `app`.

## 3. EC2 sizing (starting point)

- **Jenkins**: `t3.small` or larger (2+ GB RAM helps builds).
- **App**: `t3.small` or larger; increase if traffic grows.

## 4. IAM (optional but recommended)

- Attach an instance role if Jenkins or Ansible needs AWS API access (S3 artifacts, SSM, etc.). For SSH-only deploy from Jenkins, a role is optional.

## 5. Elastic IP (optional)

- Associate an Elastic IP with `app` if you want a stable public URL for `CORS_ORIGIN` and bookmarks.

## 6. DNS (optional)

- Point an A record to the app Elastic IP; set `CORS_ORIGIN` to `http://your-domain` (or `https://` after TLS).

After networking is ready, follow [jenkins-setup.md](jenkins-setup.md) and run the Ansible playbook from the Jenkins server (or from CI) as documented in the repo root `README` deployment section.
