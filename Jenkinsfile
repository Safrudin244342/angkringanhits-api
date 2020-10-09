def builderDocker

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
          builderDocker = docker.build("244342/angkringanbackend:${commitHash}")
        }
      }

    }

    stage('push image') {

      steps {
        script {
          builderDocker.push("${env.GIT_BRANCH}")
        }
      }

    }

    stage('remove local images') {
      
      steps {
        script {
          sh("docker rm 244342/angkringanbackend:${commitHash}")
          sh("docker rm 244342/angkringanbackend:${env.GIT_BRANCH}")
        }
      }

    }

  }
}