const model = require('../Model/User')
const ObjectHash = require('object-hash')
const Verifikasi = require('../Helper/Verifikasi')
const Hash = require('../Helper/Hash')
const RedisDB = require('../Config/RedisDB')
const Bcrypt = require('bcrypt')
const Respon = require('../Config/Respon')
const JWT = require('jsonwebtoken')
const user = {}

user.getAll = async (req, res) => {
  try {
    const data = await model.getAll()
    RedisDB.client.setex(`user${req.url}`, 60, JSON.stringify(data))
    
    return res.send(Respon.Succes(200, data))
  } catch (error) {
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

user.addUser = async (req, res) => {
  try {
    const { username, password, rule } = req.body

    if (!Verifikasi.input(username, 'string')) return res.send(Respon.Failed(400, "invalid username, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(password, 'string')) return res.send(Respon.Failed(400, "invalid password, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(rule, 'string')) return res.send(Respon.Failed(400, "invalid rule, it must be a string and contain no symbol(', <, >)"))

    const passwordHash = await Hash(password)

    await model.addUser(username, passwordHash, rule)
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    console.warn(err)
    return res.send(Respon.Failed(500, 'cannot add data to database, database error'))
  }
}

user.remUser = async (req, res) => {
  try {
    const id = req.params.id

    const result = await model.remUserBy(id)
    if (result.rowCount === 0) return res.send(Respon.Failed(400, `User with id ${id} not found`))

    let token = null
    if (req.newToken) token = req.newToken
    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    console.log(err)
    return res.send(Respon.Failed(500, 'cannot del data to database, database error'))
  }
}

user.auth = async (req, res) => {
  try {
    const username = req.body.username
    const passReq = req.body.password

    if (!Verifikasi.input(username, 'string')) return res.send(Respon.Failed(400, "invalid username, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(passReq, 'string')) return res.send(Respon.Failed(400, "invalid password, it must be a string and contain no symbol(', <, >)"))
    
    
    const passDB = await model.getByUsername(username)
    if (passDB.length === 0) return res.send(Respon.Failed(401, 'username atau password salah'))

    const check = await Bcrypt.compare(passReq, passDB[0].password)

    if (!check) return res.send(Respon.Failed(401, 'username atau password salah'))

    if (check) {
      const payload = {
        user: username,
        rule: passDB[0].rule
      }

      const token = JWT.sign(payload, (process.env.JWT_KEY || 'safrudin'), { expiresIn: 60 })
      const hashToken = ObjectHash(token)

      await model.setToken(hashToken, username)

      return res.send(Respon.Succes(200, [{token}]))
    } else {
      return res.send(Respon.Failed(401, 'cannot login'))
    }
  } catch (err) {
    return res.send(Respon.Failed(500, err))
  }
}

module.exports = user