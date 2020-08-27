const express = require('express')
const Route = express.Router()
const Controller = require('../Cotroller/Product')

Route.get("/", Controller.getAll)

module.exports = Route