const controller = require('../Cotroller/User')
const express = require('express')
const Validate = require('../Middleware/Validate')
const Chace = require('../Middleware/Chace')
const route = express.Router()

route.get('/', Validate.Admin, Chace.user, controller.getAll)
route.post('/', controller.addUser)
route.post('/auth', controller.auth)
route.delete('/:id', Validate.Admin, controller.remUser)

module.exports = route