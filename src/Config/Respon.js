const Respon = (req, res, value) => {
  const token = (req.newToken || null)

  const resSend = {
    code: (value.code || 200),
    values: (value.values || null),
    success: (value.success || false),
    error: (value.error || false),
    token: token,
    errMsg: (value.errMsg || null)
  }
  
  return res.send(resSend)
}

module.exports = Respon
