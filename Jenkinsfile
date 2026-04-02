// Pipeline: build on Jenkins, deploy with Ansible over SSH to the app EC2.
//
// Prerequisites (Jenkins):
// - Credentials: "sewdl-jwt-secret" (Secret text) and "sewdl-ansible-ssh" (SSH private key for app host)
// - Node.js + npm on the agent (for npm ci / build)
// - ansible installed on the agent
// - ansible/inventory/production.ini edited with app host IP and SSH user
//
// First run: set parameter SEWDL_CORS_ORIGIN to your public app URL (e.g. http://1.2.3.4).

pipeline {
    agent any

    parameters {
        string(
            name: 'SEWDL_CORS_ORIGIN',
            defaultValue: 'http://REPLACE_WITH_APP_URL',
            description: 'Public browser origin for CORS (e.g. http://EC2_PUBLIC_IP or http://your-domain).'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build --workspace=frontend'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    env.SEWDL_GIT_REPO_URL = sh(
                        returnStdout: true,
                        script: 'git config --get remote.origin.url'
                    ).trim()
                }
                withCredentials([
                    string(credentialsId: 'sewdl-jwt-secret', variable: 'JWT_SECRET'),
                    sshUserPrivateKey(
                        credentialsId: 'sewdl-ansible-ssh',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    sh """
                        cd ansible
                        export ANSIBLE_HOST_KEY_CHECKING=false
                        ansible-playbook -i inventory/production.ini playbooks/deploy.yml \\
                          --private-key "\$SSH_KEY" \\
                          -e sewdl_jwt_secret="\$JWT_SECRET" \\
                          -e sewdl_git_repo='${env.SEWDL_GIT_REPO_URL}' \\
                          -e sewdl_cors_origin='${params.SEWDL_CORS_ORIGIN}'
                    """
                }
            }
        }
    }
}
