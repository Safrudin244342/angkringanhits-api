const express = require('express')
const Routes = express.Router()
const Product = require('./Routes/Product')

Routes.use('/product', Product)

module.exports = Routes