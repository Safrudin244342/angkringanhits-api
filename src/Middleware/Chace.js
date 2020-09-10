const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')

const getAll = (req, resS, next) => {
  RedisDB.client.get('productAll', (err, resR) => {
    if (err) return resS.send(Respon.Failed(500, {err}))
    if (resR !== null) return resS.send(Respon.Succes(200, JSON.parse(resR)))
    next()
  })
}

module.exports = getAll
