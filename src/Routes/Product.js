const express = require('express')
const Route = express.Router()
const Controller = require('../Cotroller/Product')

Route.get("/", Controller.all)
Route.post("/", Controller.add)
Route.put("/:id", Controller.update)
Route.delete("/:id", Controller.delete)
Route.get("/by/:sortBy/:action", Controller.sort)
Route.get("/search", Controller.search)

module.exports = Route