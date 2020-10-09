def brance

pipeline {

  agent any

  stages {
    
    stage('build') {
      brance = env.BRANCH_NAME
      steps {
        echo 'build'
        echo brance
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