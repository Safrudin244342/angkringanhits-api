const express = require('express')
const Routes = express.Router()
const Product = require('./Routes/Product')
const History = require('./Routes/History')
const Category = require('./Routes/Category')
const User = require('./Routes/User')
const Respon = require('./Config/Respon')

Routes.use('/product', Product)
Routes.use('/history', History)
Routes.use('/category', Category)
Routes.use('/user', User)

Routes.get('/', (req, res) => {
  return Respon(req, res, {code: 200, success:true})
})

module.exports = Routes
