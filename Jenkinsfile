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
        script {
          commitHash = sh (script : "git log -n 1 --pretty=format:'%H'", returnStdout: true)
          echo "${commitHash}"
        }
      }
    }

  }
}