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
                sh './deploy'
            }
        }
    }
}
