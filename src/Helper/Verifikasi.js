const Verifikasi = {}

Verifikasi.input = (input, typeData) => {
  input = String(input)
  const badChar = ["'", '<', '>']

  if (typeof input === 'undefined') return false
  if (input.length === 0) return false
  if (badChar.some(badChar => input.indexOf(badChar) >= 0)) return false

  if (typeData === 'string') {
    if (typeof (input) !== 'string') return false
    return true
  } else if (typeData === 'number') {
    if (isNaN(parseInt(input))) return false
    return true
  } else {
    return false
  }
}

module.exports = Verifikasi
