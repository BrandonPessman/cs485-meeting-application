pipeline {
    agent {
        docker {
            image 'mhart/alpine-node:14'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'false'
    }
    stages {
        stage('Build') {
            steps {
                dir("frontend") {
                    sh "echo '================== FRONTEND BUILD =================='"
                    sh 'npm install'
                    sh 'npm run build'
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