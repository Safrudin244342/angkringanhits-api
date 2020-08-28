const express = require('express')
const Routes = require('./src/main')
const Server = express()
const MyDb = require('./src/Config/Database')
const bodyParser = require('body-parser')
const Port = 3000

const log = (req, res, next) => {
  const user = req.headers['user-agent']
  const method = req.method
  const url = req.url

  console.log(`${user} > Method: ${method} > url: ${url}`)
  next()
}

Server.use(bodyParser.urlencoded({ extended: false }))
Server.use(bodyParser.json())
Server.use(log)
Server.use(Routes)

MyDb.connect()
  .then(res => {
    Server.listen(Port, () => {
      console.log(`Server listening in port ${Port}`)
    })
  })
  .catch(err => {
    console.log(err)
    console.log('Database not Connected')
  })
