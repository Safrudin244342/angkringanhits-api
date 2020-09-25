const WoodlotCustom = require('woodlot').customLogger

Woodlot = (filename, level, message) => {
  const log = new WoodlotCustom({
    streams: [`log/error/${filename}`],
    stdout: false,
    format: {
      type: 'json',
      options: {
        spacing: 4,
        separator: '\n'
      }
    }
  })

  if (level === 'warn') log.warn(message)
  if (level === 'err') log.err(message)
}

module.exports = Woodlot
