const LOG = require('simple-node-logger')
const fs = require('fs')

const fileLog = `log/${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`

try {
  if (!fs.existsSync(fileLog)){
    fs.writeFileSync(fileLog)
  }
} catch (err) {
  console.log(err)
}

const opts = {
  logFilePath: fileLog,
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
}

module.exports = LOG.createSimpleLogger(opts)