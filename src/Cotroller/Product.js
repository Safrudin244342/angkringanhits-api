const Model = require('../Model/Product')
const RedisDB = require('../Config/RedisDB')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const cloudinary = require('../Config/Cloudinary')
const fs = require('fs')
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

    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})

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

    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(price, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid price, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(stock, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid stock, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})
    if (!req.file) return Respon(req, res, {code: 400, errMsg:"invalid image, image must be a image", error:true})
    
    let imgLocation = req.file.path
    await cloudinary.uploader.upload(imgLocation, { tag: 'product' }, (err, image) => {
      if (err) return Respon(req, res, {code: 400, errMsg:err, error:true})
      imgLocation = image.url
      imageid = image.public_id
    })

    fs.unlink(req.file.path, err => console.log(err))

    if (imgLocation === req.file.path) imgLocation = `${process.env.APP_HOST}/${imgLocation}`

    if (!Verifikasi.input(imgLocation, 'string')) return Respon(req, res, {code: 400, errMsg:'invalid image, it must be a image file', error:true})

    await Model.add(name, price, stock, imgLocation, category, imageid)

    RedisDB.client.select(0)
    RedisDB.client.flushdb()

    const data = {
      name,
      image: imgLocation,
      price,
      stock,
      category
    }

    return Respon(req, res, {code: 200, values: [data], success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the add function'), error:true})
  }
}

Product.update = async (req, res) => {
  try {
    const id = req.params.id
    const { name, price, stock, category } = req.body
    let imgLocation
    let imageid
    
    try {
      dbImage = await Model.getImage(id)
    } catch (err) {
      return Respon(req, res, {code: 400, errMsg:`product with id ${id} not found`, error:true})
    }

    if (req.file) {
      imgLocation = req.file.path
      await cloudinary.uploader.upload(imgLocation, { tag: 'product' }, (err, image) => {
        if (err) return Respon(req, res, {code: 400, errMsg:err, error:true})
        imgLocation = image.url
        imageid = image.public_id
      })

      if (dbImage.imageid !== null && dbImage.imageid !== '') cloudinary.uploader.destroy(dbImage.imageid)
      fs.unlink(req.file.path, err => console.log(err))
    } else {
      imgLocation = dbImage.imgLocation
      imageid = dbImage.imageid
    }

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(name, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid name, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(imgLocation, 'string')) return Respon(req, res, {code: 400, errMsg:'invalid image, it must be a image file', error:true})
    if (!Verifikasi.input(price, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid price, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(stock, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid stock, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})

    const result = await Model.update(id, name, price, stock, imgLocation, category, imageid)

    if (result.rowCount === 0) return Respon(req, res, {code: 400, errMsg:`product with id ${id} not found`, error:true})

    RedisDB.client.select(0)
    RedisDB.client.flushdb()

    const data = {
      name,
      image: imgLocation,
      price,
      stock,
      category
    }

    return Respon(req, res, {code: 200, values: [data], success:true})
  } catch (error) {
    console.log(error)
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the update function'), error:true})
  }
}

Product.delete = async (req, res) => {
  try {
    const id = req.params.id

    try {
      dbImage = await Model.getImage(id)
    } catch (err) {
      console.log(err)
      return Respon(req, res, {code: 400, errMsg:(err.message || `product with id ${id} not found`), error:true})
    }

    if (dbImage.imageid !== null && dbImage.imageid !== '') cloudinary.uploader.destroy(dbImage.imageid)

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    
    const result = await Model.delete(id)
    if (result.rowCount === 0) return Respon(req, res, {code: 400, errMsg:`product with id ${id} not found`, error:true})

    RedisDB.client.select(0)
    RedisDB.client.flushdb()

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
