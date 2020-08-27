const express = require('express')
const Route = express.Router()
const Controller = require('../Cotroller/Product')

Route.get("/", Controller.all)
Route.post("/", Controller.add)
Route.put("/", Controller.update)
Route.delete("/", Controller.delete)

module.exports = Route