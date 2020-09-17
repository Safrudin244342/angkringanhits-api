const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')
const Chace = {}

Chace.product = (req, resS, next) => {
  RedisDB.client.get(`product${req.url}`, (error, resR) => {
    if (error) return Respon(req, resS, {code: 500, errMsg:(error.message || 'cannot connect with redis'), error:true})

    if (resR !== null) return Respon(req, resS, {code: 200, values: JSON.parse(resR), success:true})
    next()
  })
}

Chace.history = (req, resS, next) => {
  RedisDB.client.get(`history${req.url}`, (err, resR) => {
    if (err) return Respon(req, resS, {code: 500, errMsg:(error.message || 'cannot connect with redis'), error:true})

    if (resR !== null) return Respon(req, resS, {code: 200, values: JSON.parse(resR), success:true})
    next()
  })
}

Chace.user = (req, resS, next) => {
  RedisDB.client.get(`user${req.url}`, (err, resR) => {
    if (err) return Respon(req, resS, {code: 500, errMsg:(error.message || 'cannot connect with redis'), error:true})

    if (resR !== null) return Respon(req, resS, {code: 200, values: JSON.parse(resR), success:true})
    next()
  })
}

module.exports = Chace
