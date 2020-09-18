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
    
    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the get all function'), error:true})
  }
}

user.addUser = async (req, res) => {
  try {
    const { username, password, rule } = req.body

    if (!Verifikasi.input(username, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid username, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(password, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid password, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(rule, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid rule, it must be a string and contain no symbol(', <, >)", error:true})
    const passwordHash = await Hash(password)

    await model.addUser(username, passwordHash, rule)

    RedisDB.client.select(2)
    RedisDB.client.flushdb()

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the addUser function'), error:true})
  }
}

user.remUser = async (req, res) => {
  try {
    const id = req.params.id

    const result = await model.remUserBy(id)
    console.log(result.rowCount)
    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`User with id ${id} not found`, error:true})

    RedisDB.client.select(2)
    RedisDB.client.flushdb()

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the remUser function'), error:true})
  }
}

user.auth = async (req, res) => {
  try {
    const username = req.body.username
    const passReq = req.body.password

    if (!Verifikasi.input(username, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid username, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(passReq, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid password, it must be a string and contain no symbol(', <, >)", error:true})    
    
    const passDB = await model.getByUsername(username)
    if (passDB.length === 0) return Respon(req, res, {code: 200, errMsg:'Username atau Password salah', error:true})

    const check = await Bcrypt.compare(passReq, passDB[0].password)

    if (!check) return Respon(req, res, {code: 200, errMsg:'Username atau Password salah', error:true})

    const payload = {
      user: username,
      rule: passDB[0].rule
    }

    const token = JWT.sign(payload, (process.env.JWT_KEY || 'safrudin'), { expiresIn: 60 })
    const hashToken = ObjectHash(token)

    await model.setToken(hashToken, username)

    return Respon(req, res, {code: 200, values:[{token}], success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the auth function'), error:true})
  }
}

user.logout = async (req, res) => {
  try {
    const username = req.user

    const result = await model.logout(username)
    if (result.rowCount === 0) return Respon(req, res, {code: 400, errMsg: 'Username not found'})
    if (req.newToken) req.newToken = null

    return Respon(req, res, {code: 200, success: true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the logout function')})
  }
}

module.exports = user