const express = require('express')
const Route = express.Router()
const History = require('../Cotroller/History')

Route.get('/', History.all)
Route.post('/', History.add)
Route.put('/:id', History.update)
Route.delete('/:id', History.delete)
Route.get('/report', History.report)
Route.get('/for/:state', History.getFor)
Route.get('/report/:state', History.allReport)

module.exports = Route
