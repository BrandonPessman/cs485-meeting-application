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
                    git add --chmod=+x "./deploy.sh"
                    sh "echo '================== Deploy Script =================='"
                    sh 'bash ./deploy.sh'
            }
        }
    }
}