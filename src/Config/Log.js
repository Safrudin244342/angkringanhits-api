const LOG = require('simple-node-logger')

const opts = {
  logFilePath:`log/${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
}

module.exports = LOG.createSimpleLogger(opts)