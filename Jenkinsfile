def brance

pipeline {

  agent any

  stages {
    
    stage('build project') {

      steps {
        nodejs('npm') {
          sh 'npm install'
          echo 'build finish'
        }
      }
    }

    stage('build docker image') {
      steps {
        echo 'build docker image'
      }
    }

  }
}