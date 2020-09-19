const Respon = require('../Config/Respon')
const ModelUser = require('../Model/User')
const JWT = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const ObjectHash = require('object-hash')
const Hash = require('../Helper/Hash')
const Bcrypt = require('bcrypt')

const Token = {}

Token.Refrash = async (req) => {
  try {
    const tokenReq = req.headers.token
    const { user } = jwtDecode(tokenReq)
    const dataDb = await ModelUser.getToken(user)
    if (dataDb.length <= 0) return false
  
    console.log(tokenReq)
    console.log(ObjectHash(tokenReq))
    console.log(dataDb[0].token)
    console.log(user)
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
    req.user = user

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

Token.Admin = (req, res, next) => {
  const token = req.headers.token

  if (!token) return Respon(req, res, {code: 400, errMsg:'login first', error:true})
  const { user, rule } = jwtDecode(token)
  req.user = user
  
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

  if (!token) return Respon(req, res, {code: 400, errMsg:'login first', error:true})
  const { user, rule } = jwtDecode(token)
  req.user = user

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