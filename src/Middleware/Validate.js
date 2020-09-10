const Respon = require('../Config/Respon')
const ModelUser = require('../Model/User')
const JWT = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const Hash = require('../Helper/Hash')
const Bcrypt = require('bcrypt')

const Token = {}

Token.Refrash = async (req) => {
  const tokenReq = req.headers.token
  const { user } = jwtDecode(tokenReq)
  const dataDb = await ModelUser.getToken(user)
  if (dataDb.length <= 0) return false
  
  const checkToken = await Bcrypt.compare(tokenReq, dataDb[0].token)
  console.log(checkToken)
  console.log(dataDb[0].token)
  if (!checkToken) return false
  
  const { rule } = dataDb
  const payload = {
    user,
    rule
  }

  const newToken = JWT.sign(payload, (process.env.JWT_KEY || 'safrudin'), { expiresIn: 60 })
  const newHashToken = await Hash(newToken)

  await ModelUser.setToken(newHashToken, user)
  req.newToken = newToken

  return true
}

const checkToken = (req, res, next) => {
  const token = req.headers.token

  if (!token) return res.send(Respon.Failed(401, 'kamu belum login'))

  const { role } = jwtDecode(token)

  JWT.verify(token, (process.env.JWT_KEY || 'safrudin'), async (err, decode) => {
    if (err) {
      if (err.message !== 'jwt expired') return res.send(Respon.Failed(401, err.message)) 
      const newToken = await Token.Refrash(req)
      if (!newToken) return res.send(Respon.Failed(401, 'token invalid'))
    }
    
    next()
  })
}

module.exports = checkToken