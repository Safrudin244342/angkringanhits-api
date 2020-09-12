const controller = require('../Cotroller/User')
const express = require('express')
const route = express.Router()

route.post('/', controller.addUser)
route.post('/auth', controller.auth)

module.exports = route