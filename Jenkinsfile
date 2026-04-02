pipeline {
    agent any

    parameters {
        string(
            name: 'SEWDL_CORS_ORIGIN',
            defaultValue: 'http://13.206.83.23',
            description: 'Public browser origin for CORS (e.g. http://EC2_PUBLIC_IP or http://your-domain).'
        )
    }

    stages {

        // ✅ Use Jenkins' built-in checkout (already configured with correct branch)
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
                    sh '''
                        cd ansible
                        export ANSIBLE_HOST_KEY_CHECKING=false

                        ansible-playbook -i inventory/production.ini playbooks/deploy.yml \
                          --private-key "$SSH_KEY" \
                          -e sewdl_jwt_secret="$JWT_SECRET" \
                          -e sewdl_git_repo="$SEWDL_GIT_REPO_URL" \
                          -e sewdl_cors_origin="$SEWDL_CORS_ORIGIN"
                    '''
                }
            }
        }
    }
}