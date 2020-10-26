const LOG = require('./Log')
const Woodlt = require('./Woodlot')

const Respon = (req, res, value) => {
  const token = (req.newToken || null)

  if (value.code >= 500) {
    const filename = new Date().getTime()
    const message = {
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      error: {
        url: req.originalUrl,
        error: value.errMsg
      }
    }
    Woodlt(`${filename}.json`, 'warn', message)
    LOG.warn('Error code: ', value.code, ` error detail: error/${filename}.json`)
  }

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
