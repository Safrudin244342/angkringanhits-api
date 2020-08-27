const express = require('express')
const Route = express.Router()
const Controller = require('../Cotroller/Product')

Route.get("/", Controller.all)
Route.post("/", Controller.add)

module.exports = Route