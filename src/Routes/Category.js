const express = require('express')
const Route = express.Router()
const Validate = require('../Middleware/Validate')
const Category = require('../Cotroller/Category')

Route.get('/', Category.all)
Route.post('/', Validate.Admin, Category.add)
Route.put('/:id', Validate.Admin, Category.update)
Route.delete('/:id', Validate.Admin, Category.delete)

module.exports = Route
