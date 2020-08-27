const Respon = {}

Respon.Succes = (code, values) => {
    let res = {
        code: code,
        values: values,
        success: true,
        error: false,
        errMsg: null
    }

    return res
}

Respon.Failed = (code, msg) => {
    let res = {
        code: code,
        values: [],
        success: false,
        error: true,
        errMsg: msg
    }

    return res
}

module.exports = Respon