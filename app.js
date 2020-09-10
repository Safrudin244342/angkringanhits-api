require('dotenv/config')
const express = require('express')
const Routes = require('./src/main')
const Server = express()
const MyDb = require('./src/Config/Database')
const RedisDB = require('./src/Config/RedisDB')
const bodyParser = require('body-parser')
const Port = 3000
const cors = require('cors')

const log = (req, res, next) => {
  const user = req.headers['user-agent']
  const method = req.method
  const url = req.url

  console.log(`${user} > Method: ${method} > url: ${url}`)
  next()
}

Server.use(cors())
Server.use(bodyParser.urlencoded({ extended: false }))
Server.use(bodyParser.json())
Server.use(log)
Server.use(Routes)

Server.use("", express.static('public'))

MyDb.connect()
  .then(res => {
    console.log('Database connection')
  })
  .catch(err => {
    console.log(err)
    console.log('Database not Connected')
  })

RedisDB.Check()
  .then(res => console.log(res))
  .catch(err => console.log(err))

Server.listen(Port, () => {
  console.log(`Server listening in port ${Port}`)
})