const express = require('express')
const Route = express.Router()
const Chace = require('../Middleware/Chace')
const Validate = require('../Middleware/Validate')
const History = require('../Cotroller/History')

Route.get('/', Validate.Admin, Chace.history, History.all)
Route.post('/', Validate.user, History.add)
Route.put('/:id', Validate.Admin, History.update)
Route.delete('/:id', Validate.Admin, History.delete)
Route.get('/report', Validate.Admin, Chace.history, History.report)
Route.get('/for/:state', Validate.Admin, Chace.history, History.getFor)
Route.get('/report/:state', Validate.Admin, Chace.history, History.allReport)

module.exports = Route
