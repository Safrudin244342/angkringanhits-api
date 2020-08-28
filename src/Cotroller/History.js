const Respon = require('../Config/Respon')
const Model = require('../Model/History')
const Verifikasi = require('../Helper/Verifikasi')
const History = {}

History.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    data.map(value => {
      let newDate = String(value.date).split(' ')
      newDate = `${newDate[2]} ${newDate[1]} ${newDate[3]}`
      value.date = newDate
    })

    return res.send(Respon.Succes(200, data))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Databse Error'))
  }
}

History.add = async (req, res) => {
  try {
    const { cashier, orders, amount } = req.body

    if (!Verifikasi.input(cashier, 'string')) return res.send(Respon.Failed(400, "Invalid cashier, it must be string and contain no symbol (', <, >)"))
    if (!Verifikasi.input(orders, 'string')) return res.send(Respon.Failed(400, "Invalid orders, it must be string and contain no symbol (', <, >)"))
    if (!Verifikasi.input(amount, 'number')) return res.send(Respon.Failed(400, "Invalid amount, it must be number and contain no symbol (', <, >)"))

    await Model.add(cashier, orders, amount)
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Cannot add history, Database Error'))
  }
}

History.update = async (req, res) => {
  try {
    const id = req.params.id
    const { cashier, orders, amount } = req.body

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "Invalid id, it must be number and contain no symbol (', <, >)"))
    if (!Verifikasi.input(cashier, 'string')) return res.send(Respon.Failed(400, "Invalid cashier, it must be string and contain no symbol (', <, >)"))
    if (!Verifikasi.input(orders, 'string')) return res.send(Respon.Failed(400, "Invalid orders, it must be string and contain no symbol (', <, >)"))
    if (!Verifikasi.input(amount, 'number')) return res.send(Respon.Failed(400, "Invalid amount, it must be number and contain no symbol (', <, >)"))

    const result = await Model.update(id, cashier, orders, amount)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Cannot find history with id ${id}`))

    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Cannot update history, Database Error'))
  }
}

History.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "Invalid id, it must be number and contain no symbol (', <, >)"))

    const result = await Model.delete(id)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Cannot find history with id ${id}`))

    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Cannot delete history, Database Error'))
  }
}

module.exports = History
