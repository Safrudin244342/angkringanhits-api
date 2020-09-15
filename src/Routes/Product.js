const express = require('express')
const Route = express.Router()
const Validate = require('../Middleware/Validate')
const Chace = require('../Middleware/Chace')
const Upload = require('../Middleware/Upload')
const Controller = require('../Cotroller/Product')

Route.get('/', Chace.product, Controller.all)
Route.post('/', Validate.Admin, Upload.single('image'), Controller.add)
Route.put('/:id', Validate.Admin, Upload.single('image'), Controller.update)
Route.delete('/:id', Validate.Admin, Controller.delete)
Route.get('/by/:sortBy/:action', Chace.product, Controller.sort)
Route.get('/search', Chace.product, Controller.search)

module.exports = Route
