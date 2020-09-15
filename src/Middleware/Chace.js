const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')
const Chace = {}

Chace.product = (req, resS, next) => {
  RedisDB.client.get(`product${req.url}`, (err, resR) => {
    if (err) return resS.send(Respon.Failed(500, {err}))

    let token = null
    if (req.newToken) token = req.newToken

    if (resR !== null) return resS.send(Respon.Succes(200, JSON.parse(resR), token))
    next()
  })
}

Chace.history = (req, resS, next) => {
  RedisDB.client.get(`history${req.url}`, (err, resR) => {
    if (err) return resS.send(Respon.Failed(500, {err}))

    let token = null
    if (req.newToken) token = req.newToken

    if (resR !== null) return resS.send(Respon.Succes(200, JSON.parse(resR), token))
    next()
  })
}

Chace.user = (req, resS, next) => {
  RedisDB.client.get(`user${req.url}`, (err, resR) => {
    if (err) return resS.send(Respon.Failed(500, {err}))

    let token = null
    if (req.newToken) token = req.newToken

    if (resR !== null) return resS.send(Respon.Succes(200, JSON.parse(resR), token))
    next()
  })
}

module.exports = Chace
