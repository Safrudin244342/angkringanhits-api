const Model = require('../Model/Product')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const Product = {}

Product.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    return res.send(Respon.Succes(200, data))
  } catch (error) {
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

Product.search = async (req, res) => {
  try {
    let name = req.query.name

    if (!Verifikasi.input(name, 'string')) return res.send(Respon.Failed(400, "invalid name, it must be a string and contain no symbol(', <, >)"))

    name = name.split(' ')
    const data = await Model.search(name)

    return res.send(Respon.Succes(200, data))
  } catch (error) {
    console.log(error)
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

Product.add = async (req, res) => {
  try {
    const { name, price, stock, imgLocation, category } = req.body

    if (!Verifikasi.input(name, 'string')) return res.send(Respon.Failed(400, "invalid name, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(imgLocation, 'string')) return res.send(Respon.Failed(400, "invalid imgLocation, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(price, 'number')) return res.send(Respon.Failed(400, "invalid price, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(stock, 'number')) return res.send(Respon.Failed(400, "invalid stock, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "invalid category, it must be a string and contain no symbol(', <, >)"))

    await Model.add(name, price, stock, imgLocation, category)
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot add data to database, database error'))
  }
}

Product.update = async (req, res) => {
  try {
    const id = req.params.id
    const { name, price, stock, imgLocation, category } = req.body

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "invalid id, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(name, 'string')) return res.send(Respon.Failed(400, "invalid name, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(imgLocation, 'string')) return res.send(Respon.Failed(400, "invalid imgLocation, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(price, 'number')) return res.send(Respon.Failed(400, "invalid price, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(stock, 'number')) return res.send(Respon.Failed(400, "invalid stock, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "invalid category, it must be a string and contain no symbol(', <, >)"))

    const result = await Model.update(id, name, price, stock, imgLocation, category)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Product with id ${id} not found`))

    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot update produck, database error'))
  }
}

Product.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "invalid id, it must be a number and contain no symbol(', <, >)"))

    const result = await Model.delete(id)
    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Product with id ${id} not found`))
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot delate data from database, database error'))
  }
}

Product.sort = async (req, res) => {
  try {
    const sortBy = req.params.sortBy
    const action = req.params.action
    const data = await Model.sort(sortBy, action)

    return res.send(Respon.Succes(200, data))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot get data from database, database error'))
  }
}

module.exports = Product
