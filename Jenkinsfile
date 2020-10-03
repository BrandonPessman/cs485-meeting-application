pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                dir("frontend") {
                    sh "echo '================== FRONTEND BUILD =================='"
                    sh 'npm install'
                }
                dir("backend") {
                    sh "echo '================== BACKEND BUILD =================='"
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                dir("frontend") {
                    sh "echo '================== FRONTEND DEPLOY =================='"
                    sh 'npm start'
                }
                dir("backend") {
                    sh "echo '================== BACKEND DEPLOY =================='"
                    sh 'node index.js'
                }
            }
        }
    }
}