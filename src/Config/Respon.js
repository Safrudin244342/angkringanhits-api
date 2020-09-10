const Respon = {}

Respon.Succes = (code, values, token) => {
  const res = {
    code: code,
    values: values,
    success: true,
    error: false,
    token: (token || null),
    errMsg: null
  }

  return res
}

Respon.Failed = (code, msg) => {
  const res = {
    code: code,
    values: [],
    success: false,
    error: true,
    token: null,
    errMsg: msg
  }

  return res
}

module.exports = Respon
