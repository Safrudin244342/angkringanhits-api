const express = require('express')
const Routes = require('./src/main')
const Server = express()
const Mydb = require('./src/Config/Database')
const MyDb = require('./src/Config/Database')
const Port = 3000

Server.use(Routes)

MyDb.connect()
    .then(res => {
        console.log("Dataase Connected")
    })
    .catch(err => {
        console.log("Database not Connected")
    })

Server.listen(Port, () => {
    console.log(`Server listening in port ${Port}`)
})