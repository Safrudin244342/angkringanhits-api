const Model = require('../Model/Product')
const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const Product = {}

Product.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))
    
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
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))

    return res.send(Respon.Succes(200, data))
  } catch (error) {
    console.log(error)
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

Product.add = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body
    if (!req.file) return  res.send(Respon.Failed(400, "invalid image, image must be a image"))
    
    let imgLocation = req.file.path
    imgLocation = imgLocation.split('/')
    imgLocation.shift()
    imgLocation = imgLocation.join('/')

    if (!Verifikasi.input(name, 'string')) return res.send(Respon.Failed(400, "invalid name, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(imgLocation, 'string')) return res.send(Respon.Failed(400, "invalid imgLocation, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(price, 'number')) return res.send(Respon.Failed(400, "invalid price, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(stock, 'number')) return res.send(Respon.Failed(400, "invalid stock, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "invalid category, it must be a string and contain no symbol(', <, >)"))

    await Model.add(name, price, stock, imgLocation, category)

    let token = null
    if (req.newToken) token = req.newToken
    RedisDB.client.del('product/')

    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    console.log(err)
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

Product.update = async (req, res) => {
  try {
    const id = req.params.id
    const { name, price, stock, category } = req.body
    let imgLocation
    try {
      imgLocation = req.file ? req.file.path:await Model.getImage(id)
    } catch (err) {
      return res.send(Respon.Failed(400, `Product with id ${id} not found`))
    }

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "invalid id, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(name, 'string')) return res.send(Respon.Failed(400, "invalid name, it must be a string and contain no symbol(', <, >)"))
    if (!Verifikasi.input(imgLocation, 'string')) return res.send(Respon.Failed(400, "invalid image"))
    if (!Verifikasi.input(price, 'number')) return res.send(Respon.Failed(400, "invalid price, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(stock, 'number')) return res.send(Respon.Failed(400, "invalid stock, it must be a number and contain no symbol(', <, >)"))
    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "invalid category, it must be a string and contain no symbol(', <, >)"))

    const result = await Model.update(id, name, price, stock, imgLocation, category)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Product with id ${id} not found`))

    let token = null
    if (req.newToken) token = req.newToken

    RedisDB.client.del('product/')
    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    console.log(err)
    return res.send(Respon.Failed(500, 'cannot update produck, database error'))
  }
}

Product.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "invalid id, it must be a number and contain no symbol(', <, >)"))

    const result = await Model.delete(id)
    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Product with id ${id} not found`))
    
    let token = null
    if (req.newToken) token = req.newToken
    RedisDB.client.del('product/')

    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot delate data from database, database error'))
  }
}

Product.sort = async (req, res) => {
  try {
    const sortBy = req.params.sortBy
    const action = req.params.action
    const data = await Model.sort(sortBy, action)
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))

    return res.send(Respon.Succes(200, data))
  } catch (err) {
    return res.send(Respon.Failed(500, 'cannot get data from database, database error'))
  }
}

module.exports = Product
