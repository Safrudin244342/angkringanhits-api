const express = require('express')
const Routes = require('./src/main')
const Product = require('./src/Cotroller/Product')
const Server = express()
const Port = 3000

Server.use(Routes)

Server.listen(Port, () => {
    console.log(`Server running in port ${Port}`)
})