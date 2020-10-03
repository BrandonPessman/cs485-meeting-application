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
                sh "sudo rm -rf /var/www/meeting-app/"
                sh "sudo cp -r ${WORKSPACE}/frontend/build/ /var/www/meeting-app/"
            }
        }
    }
}
