pipeline {
    agent any
    
    options {
        skipDefaultCheckout(true)
    }
    stages {
        stage("Git Pull") {
            steps {
                sh "git pull"
            }
        }
        stage("NPM Install (Frontend)") {
            steps {
                dir("frontend") {
                    sh "npm run build"
                }
            }
        }
        stage("Build (Frontend)") {
            steps {
                dir("frontend") {
                    sh "npm run build"
                }
            }
        }
        stage('Test (Frontend)') {
            steps {
                echo 'Testing..'
            }
        }
        stage("NPM Install (Backend)") {
            steps {
                dir("backend") {
                    sh "npm install"
                }
            }
        }
        stage('Test (Backend)') {
            steps {
                echo 'Testing..'
            }
        }
        stage("Deploy (All)") {
            steps {
                sh 'chmod +x ./deploy'
                sh './deploy'
            }
        }
    }
}
