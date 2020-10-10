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

    stage('deploy') {

      steps {
        
        script {
          if (env.GIT_BRANCH == 'master') {
            server = 'angkringan-production'
          } else if (env.GIT_BRANCH == 'dev') {
            server = 'angkringan-dev'
          }

          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: "${server}",
                verbose: false,
                transfers: [
                  sshTransfer(
                    execCommand: "docker pull 244342/angkringanbackend:${env.GIT_BRANCH}",
                    execTimeout: 120000
                  )
                ]
              )
            ]
          )
        }

      }
    }

    stage('remove local images') {
      
      steps {
        script {
          sh("docker image rm 244342/angkringanbackend:${commitHash}")
          sh("docker image rm 244342/angkringanbackend:${env.GIT_BRANCH}")
        }
      }

    }

  }
}