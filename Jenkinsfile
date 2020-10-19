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
                    execCommand: "ansible-playbook ansible/backend/build.yml -e 'branch=${env.GIT_BRANCH}' -e 'ansible_python_interpreter=/usr/bin/python2.7'",
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

          if (env.GIT_BRANCH == 'master') {
            host = "angkringanstag"
          } else if (env.GIT_BRANCH == 'dev') {
            host = "angkringandev"
          }

          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: "ansible-master",
                verbose: false,
                transfers: [
                  sshTransfer(
                    execCommand: "ansible-playbook -i ansible/hosts ansible/backend/deploy.yml -e 'branch=${env.GIT_BRANCH}' -e 'host=${host}'",
                    execTimeout: 120000
                  )
                ]
              )
            ]
          )

        }

      }
    }

  }
  
}