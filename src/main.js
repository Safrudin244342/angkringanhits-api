const express = require('express')
const Routes = express.Router()
const Product = require('./Routes/Product')
const History = require('./Routes/History')

Routes.use('/product', Product)
Routes.use('/history', History)

module.exports = Routes