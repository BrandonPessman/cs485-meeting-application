pipeline {
    agent {
        docker {
            image 'node:current-alpine3.12'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'false'
    }
    stages {
        stage('Deploy') {
            steps {
                    sh 'chmod +x ./deploy'
                    sh "echo '================== Deploy Script =================='"
                    sh './deploy'
            }
        }
    }
}