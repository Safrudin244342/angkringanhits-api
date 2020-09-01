const express = require('express')
const Routes = express.Router()
const Product = require('./Routes/Product')
const History = require('./Routes/History')
const Category = require('./Routes/Category')
const Respon = require('./Config/Respon')

Routes.use('/product', Product)
Routes.use('/history', History)
Routes.use('/category', Category)

Routes.get('/', (req, res) => {
  res.send(Respon.Succes(200, []))
})

module.exports = Routes
