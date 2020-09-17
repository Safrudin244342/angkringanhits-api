const Model = require('../Model/Category')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const Category = {}

Category.all = async (req, res) => {
  try {
    const data = await Model.all()

    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the get all category function'), error:true})
  }
}

Category.add = async (req, res) => {
  try {
    const { category } = req.body

    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})

    await Model.add(category)

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the add category function'), error:true})
  }
}

Category.update = async (req, res) => {
  try {
    const id = req.params.id
    const { category } = req.body

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(category, 'string')) return Respon(req, res, {code: 400, errMsg:"invalid category, it must be a string and contain no symbol(', <, >)", error:true})

    const result = await Model.update(id, category)

    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`category with id ${id} not found`, error:true})
    
    return Respon(req, res, {code: 200, success:true})
  } catch (err) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the update category function'), error:true})
  }
}

Category.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 400, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})

    const result = await Model.delete(id)

    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`category with id ${id} not found`, error:true})
    
    return Respon(req, res, {code: 200, success:true})
  } catch (err) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the update category function'), error:true})
  }
}

module.exports = Category
