const Respon = require('../Config/Respon')
const ModelUser = require('../Model/User')
const JWT = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const ObjectHash = require('object-hash')
const Hash = require('../Helper/Hash')
const Bcrypt = require('bcrypt')

const Token = {}

Token.Refrash = async (req) => {
  const tokenReq = req.headers.token
  const { user } = jwtDecode(tokenReq)
  const dataDb = await ModelUser.getToken(user)
  if (dataDb.length <= 0) return false
  
  const checkToken = ObjectHash(tokenReq) === dataDb[0].token
  if (!checkToken) return false
  
  const { rule } = dataDb[0]
  
  const payload = {
    user,
    rule
  }

  const newToken = JWT.sign(payload, (process.env.JWT_KEY || 'safrudin'), { expiresIn: 60 })
  const newHashToken = ObjectHash(newToken)

  await ModelUser.setToken(newHashToken, user)
  req.newToken = newToken

  return true
}

Token.Admin = (req, res, next) => {
  const token = req.headers.token

  if (!token) return Respon(req, res, {code: 400, errMsg:'kamu belum login', error:true})

  const { rule } = jwtDecode(token)
  if (rule !== 'admin') return Respon(req, res, {code: 400, errMsg:"you don't have permission", error:true})

  JWT.verify(token, (process.env.JWT_KEY || 'safrudin'), async (error, decode) => {
    if (error) {
      if (error.message !== 'jwt expired') return Respon(req, res, {code: 500, errMsg:(error.message || 'token invalid'), error:true})
      const newToken = await Token.Refrash(req)
      if (!newToken) return Respon(req, res, {code: 500, errMsg:'token invalid', error:true})
    }
    
    next()
  })
}

Token.user = (req, res, next) => {
  const token = req.headers.token

  if (!token) return Respon(req, res, {code: 400, errMsg:'kamu belum login', error:true})

  JWT.verify(token, (process.env.JWT_KEY || 'safrudin'), async (error, decode) => {
    if (error) {
      if (error.message !== 'jwt expired') return Respon(req, res, {code: 500, errMsg:(error.message || 'token invalid'), error:true})
      const newToken = await Token.Refrash(req)
      if (!newToken) return Respon(req, res, {code: 500, errMsg:'token invalid', error:true})
    }
    
    next()
  })
}

module.exports = Token