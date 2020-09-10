const express = require('express')
const Route = express.Router()
const Validate = require('../Middleware/Validate')
const Chace = require('../Middleware/Chace')
const Upload = require('../Middleware/Upload')
const Controller = require('../Cotroller/Product')

Route.get('/', Validate, Chace, Controller.all)
Route.post('/', Upload.single('image'), Controller.add)
Route.put('/:id', Controller.update)
Route.delete('/:id', Controller.delete)
Route.get('/by/:sortBy/:action', Controller.sort)
Route.get('/search', Controller.search)

module.exports = Route
