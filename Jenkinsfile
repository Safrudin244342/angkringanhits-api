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

          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: "kubernetes",
                verbose: false,
                transfers: [
                  sshTransfer(
                    execCommand: "kubectl get pods -n angkringanhits-master | grep backend | kubectl delete pod \$(awk {'print \$ 1'}) -n angkringanhits-master",
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