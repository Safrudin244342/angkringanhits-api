const Model = require('../Model/Product')
const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const Product = {}

Product.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))
    
    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the get all function'), error:true})
  }
}

Product.search = async (req, res) => {
  try {
    let name = req.query.name

    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})

    name = name.split(' ')
    const data = await Model.search(name)
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))

    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the search function'), error:true})
  }
}

Product.add = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body
    if (!req.file) return res.send(Respon.Failed(400, "invalid image, image must be a image"))
    
    let imgLocation = req.file.path
    imgLocation = imgLocation.split('/')
    imgLocation.shift()
    imgLocation = imgLocation.join('/')

    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(imgLocation, 'string')) return Respon(req, res, {code: 400, errMsg:'invalid image, it must be a image file', error:true})
    if (!Verifikasi.input(price, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid price, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(stock, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid stock, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})

    await Model.add(name, price, stock, imgLocation, category)

    RedisDB.client.del('product/')

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the add function'), error:true})
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
      return Respon(req, res, {code: 200, errMsg:`product with id ${id} not found`, error:true})
    }

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(imgLocation, 'string')) return Respon(req, res, {code: 400, errMsg:'invalid image, it must be a image file', error:true})
    if (!Verifikasi.input(price, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid price, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(stock, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid stock, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})

    const result = await Model.update(id, name, price, stock, imgLocation, category)

    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`product with id ${id} not found`, error:true})

    RedisDB.client.del('product/')
    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the update function'), error:true})
  }
}

Product.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    
    const result = await Model.delete(id)
    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`product with id ${id} not found`, error:true})

    RedisDB.client.del('product/')

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the delete function'), error:true})
  }
}

Product.sort = async (req, res) => {
  try {
    const sortBy = req.params.sortBy
    const action = req.params.action
    const data = await Model.sort(sortBy, action)
    RedisDB.client.setex(`product${req.url}`, 60, JSON.stringify(data))

    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the sort function'), error:true})
  }
}

module.exports = Product
