const express = require('express')
const Route = express.Router()
const Category = require('../Cotroller/Category')

Route.get('/', Category.all)
Route.post('/', Category.add)

module.exports = Route
