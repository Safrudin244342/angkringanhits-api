const Model = require('../Model/Product')
const Respon = require('../Config/Respon')
const Product = {}

Product.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    return res.send(Respon.Succes(200, data))
  } catch (error) {
    return res.send(Respon.Failed(500, 'cannot get data from database'))
  }
}

Product.search = async (req, res) => {
  try {
    let name = req.query.name

    if (typeof (name) !== 'string' || name.length === 0) return res.send(Respon.Failed(400, 'name must be string'))

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

    if (typeof (name) !== 'string') return res.send(Respon.Failed(400, 'name must be string'))
    if (typeof (imgLocation) !== 'string') return res.send(Respon.Failed(400, 'imgLocation must be string'))
    if (isNaN(parseInt(price))) return res.send(Respon.Failed(400, 'price must be number'))
    if (isNaN(parseInt(stock))) return res.send(Respon.Failed(400, 'stock must be number'))
    if (typeof (category) !== 'string') return res.send(Respon.Failed(400, 'category must be string'))

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

    if (isNaN(parseInt(id))) return res.send(Respon.Failed(400, 'id must be number'))
    if (typeof (name) !== 'string') return res.send(Respon.Failed(400, 'name must be string'))
    if (typeof (imgLocation) !== 'string') return res.send(Respon.Failed(400, 'imgLocation must be string'))
    if (isNaN(parseInt(price))) return res.send(Respon.Failed(400, 'price must be number'))
    if (isNaN(parseInt(stock))) return res.send(Respon.Failed(400, 'stock must be number'))
    if (typeof (category) !== 'string') return res.send(Respon.Failed(400, 'category must be string'))

    await Model.update(id, name, price, stock, imgLocation, category)
    return res.send(Respon.Succes(200, []))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot update produck, database error'))
  }
}

Product.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (isNaN(parseInt(id))) return res.send(Respon.Failed(400, 'id must be number'))

    await Model.delete(id)
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
