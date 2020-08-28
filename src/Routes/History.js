const express = require('express')
const Route = express.Router()
const History = require('../Cotroller/History')

Route.get('/', History.all)
Route.post('/', History.add)
Route.put('/:id', History.update)
Route.delete('/:id', History.delete)

module.exports = Route
