const LOG = require('simple-node-logger')
const fs = require('fs')

const fileLog = `log/${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`

try {
  if (!fs.existsSync('./log')) {
    fs.mkdir("./log", function(err) {
      if (err) {
        console.log(err)
      }
    })
  }
  if (!fs.existsSync(fileLog)){
    fs.writeFileSync(fileLog, "\n")
  }
} catch (err) {
  console.log(err)
}

const opts = {
  logFilePath: fileLog,
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
}

module.exports = LOG.createSimpleLogger(opts)