const express = require('express')
const Routes = express.Router()
const Product = require('./Routes/Product')
const History = require('./Routes/History')
const Category = require('./Routes/Category')

Routes.use('/product', Product)
Routes.use('/history', History)
Routes.use('/category', Category)

module.exports = Routes
