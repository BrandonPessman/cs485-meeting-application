pipeline {
    agent any
    
    options {
        skipDefaultCheckout(true)
    }
    stages {
        stage("Frontend NPM Install") {
            steps {
                dir("frontend") {
                    sh "npm run build"
                }
            }
        }
        stage("Frontend Build") {
            steps {
                dir("frontend") {
                    sh "npm run build"
                }
            }
        }
        stage('Frontend Tests') {
            steps {
                echo 'Testing..'
            }
        }
        stage("Backend NPM Install") {
            steps {
                dir("backend") {
                    sh "npm install"
                }
            }
        }
        stage('Backend Tests') {
            steps {
                echo 'Testing..'
            }
        }
        stage("Deploy") {
            steps {
                sh 'chmod +x ./deploy'
                sh './deploy'
            }
        }
    }
}
