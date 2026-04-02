pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ohmingx/CMS-MVP'
            }
        }

        stage('Debug') {
            steps {
                sh 'ls -la'
                echo "Now Jenkinsfile is executing"
            }
        }
    }
}