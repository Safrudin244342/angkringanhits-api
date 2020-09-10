const model = require('../Model/User')
const Hash = require('../Helper/Hash')
const Bcrypt = require('bcrypt')
const Respon = require('../Config/Respon')
const JWT = require('jsonwebtoken')
const user = {}

user.addUser = async (req, res) => {
  try {
    const { username, password, rule } = req.body
    const passwordHash = await Hash(password)

    await model.addUser(username, passwordHash, rule)
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    console.warn(err)
    return res.send(Respon.Failed(500, 'cannot add data to database, database error'))
  }
}

user.auth = async (req, res) => {
  try {
    const username = req.body.username
    const passReq = req.body.password
    
    const passDB = await model.getByUsername(username)
    if (passDB.length === 0) return res.send(Respon.Failed(401, 'user tidak terdaftar'))

    const check = await Bcrypt.compare(passReq, passDB[0].password)

    if (check) {
      const payload = {
        user: username,
        role: passDB[0].role
      }

      const token = JWT.sign(payload, (process.env.JWT_KEY || 'safrudin'), { expiresIn: 60 })
      const hashToken = await Hash(token)

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