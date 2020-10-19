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
          
          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: "ansible-master",
                verbose: false,
                transfers: [
                  sshTransfer(
                    remoteDirectory: "/home/ansible/ansible/backend",
                    execCommand: "pwd",
                    execTimeout: 120000
                  )
                ]
              )
            ]
          )

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
          echo "deploy"
        }

      }
    }

  }
  
}