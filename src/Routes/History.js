const express = require('express')
const Route = express.Router()
const Validate = require('../Middleware/Validate')
const History = require('../Cotroller/History')

Route.get('/', Validate.Admin, History.all)
Route.post('/', Validate.Admin, History.add)
Route.put('/:id', Validate.Admin, History.update)
Route.delete('/:id', Validate.Admin, History.delete)
Route.get('/report', Validate.Admin, History.report)
Route.get('/for/:state', Validate.Admin, History.getFor)
Route.get('/report/:state', Validate.Admin, History.allReport)

module.exports = Route
