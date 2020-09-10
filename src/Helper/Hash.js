const bcrypt = require('bcrypt')

async function hash(text) {
  try {
    const salt = await bcrypt.genSalt(5)
    const result = await bcrypt.hash(text, salt)

    return result
  } catch(err) {
    throw err
  }
}

module.exports = hash
