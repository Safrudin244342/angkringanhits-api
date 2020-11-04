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

    stage('deploy application') {
      
      steps{
        script {
          if (env.GIT_BRANCH == 'master') {
            cmd = 'ansible-playbook -i ansible/hosts ansible/deploy-prod.yml -e "branch=server-prod" -e "host=${host}"'
          } else if (env.GIT_BRANCH == 'dev') {
            cmd = 'ansible-playbook -i ansible/hosts ansible/deploy-dev.yml -e "branch=server-dev" -e "host=${host}"'
          }
          
          sh cmd
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
