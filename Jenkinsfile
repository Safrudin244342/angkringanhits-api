def brance

pipeline {

  agent any

  stages {
    
    stage('build') {

      steps {
        echo "build brach ${env.BRANCH_NAME}"
        echo 'finish'
      }
    }

    stage('build docker image') {
      steps {
        echo 'build docker image'
      }
    }

  }
}