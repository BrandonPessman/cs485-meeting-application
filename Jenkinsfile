pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
     
    stage('Build') {
      steps {
        sh 'cd ./frontend/'
        sh 'npm install'
        sh 'npm run build'
      }
    }  
    
            
    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}