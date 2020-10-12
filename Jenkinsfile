def builderDocker

pipeline {

  agent any

  parameters {
    choice(name: 'CICD', choices: ['CICD', 'CI'], description: 'Pilih salah satu')
    booleanParam(name: 'RMI', defaultValue: true, description: 'Remove image after build')
  }

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
          if (env.GIT_BRANCH == 'master') {
            api_host = '100.26.51.189'
          } else if (env.GIT_BRANCH == 'dev') {
            api_host = '34.205.68.49'
          } else {
            api_host = '52.90.170.145'
          }

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
      when {
        expression {
          env.GIT_BRANCH == 'dev' || env.GIT_BRANCH == 'master'
          params.CICD == 'CICD'
        }
      }

      steps {
        
        script {
          if (env.GIT_BRANCH == 'master') {
            server = 'angkringan-production'
            command = "/home/beningproduction/docker/docker-update.sh"
          } else if (env.GIT_BRANCH == 'dev') {
            server = 'angkringan-dev'
            command = "/home/beningdev/docker/docker-update.sh"
          }

          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: "${server}",
                verbose: false,
                transfers: [
                  sshTransfer(
                    execCommand: "${command}",
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

      when {
        expression {
          params.RMI
        }
      }
      
      steps {
        script {
          sh("docker image rm 244342/angkringanbackend:${commitHash}")
          sh("docker image rm 244342/angkringanbackend:${env.GIT_BRANCH}")
        }
      }

    }

  }
  
}