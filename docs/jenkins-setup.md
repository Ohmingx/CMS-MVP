# Jenkins + Ansible on Ubuntu 22.04 (Jenkins EC2)

Run these steps **on the Jenkins EC2 instance** as a user with `sudo`.

## 1. Install Java 17 (Jenkins requirement)

```bash
sudo apt update
sudo apt install -y fontconfig openjdk-17-jre
```

## 2. Install Jenkins (LTS)

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

Open `http://<jenkins-public-ip>:8080`, complete the setup wizard, install suggested plugins, and create an admin user.

Initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## 3. Install Ansible

```bash
sudo apt install -y ansible sshpass
ansible --version
```

## 4. Install Node.js for pipeline builds (same host as Jenkins)

The `Jenkinsfile` runs `npm ci` on the controller workspace. Install Node 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 5. SSH key for deploy (Jenkins → app EC2)

On the Jenkins server:

```bash
sudo -u jenkins ssh-keygen -t ed25519 -C "jenkins-ansible-sewdl" -f /var/lib/jenkins/.ssh/sewdl_app -N ""
sudo cat /var/lib/jenkins/.ssh/sewdl_app.pub
```

Append the **public** key to `~/.ssh/authorized_keys` on the **app** instance for the deploy user (e.g. `ubuntu` or the user in `ansible/inventory/production.ini`).

Fix permissions:

```bash
sudo chown -R jenkins:jenkins /var/lib/jenkins/.ssh
sudo chmod 700 /var/lib/jenkins/.ssh
sudo chmod 600 /var/lib/jenkins/.ssh/sewdl_app
```

## 6. Jenkins credentials

In **Manage Jenkins → Credentials**, add:

| Kind | ID (use in Jenkinsfile or override) | Purpose |
|------|----------------------------------------|---------|
| SSH Username with private key | `sewdl-ansible-ssh` | Private key `/var/lib/jenkins/.ssh/sewdl_app` for Ansible over SSH |
| Secret text | `sewdl-jwt-secret` | Passed to Ansible as `sewdl_jwt_secret` |
| String parameters (optional) | — | `CORS_ORIGIN`, `GIT_REPO_URL` if not using defaults |

## 7. Create pipeline job

- New Item → Pipeline → Pipeline script from SCM → Git → your repo URL → branch `main`.
- Ensure the Jenkins user can read the repo (deploy key or credential).

## 8. Install Ansible on Jenkins node (already done)

The deploy stage runs `ansible-playbook` from the workspace; the playbook path is `ansible/playbooks/deploy.yml`.

If builds run on **agents** instead of the built-in node, install Ansible + SSH key on that agent too.
