pipeline {
    agent any
    
    stages {
        stage("Build") {
            steps {
                dir("frontend") {
                    sh "npm install"
                    sh "npm run build"
                }
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
