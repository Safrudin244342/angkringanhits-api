const Model = require('../Model/Category')
const Respon = require('../Config/Respon')
const Verifikasi = require('../Helper/Verifikasi')
const Category = {}

Category.all = async (req, res) => {
  try {
    const data = await Model.all()

    return res.send(Respon.Succes(200, data))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Database Error'))
  }
}

Category.add = async (req, res) => {
  try {
    const { category } = req.body

    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "invalid category, it must be string and contain no symbol (', <, >)"))

    await Model.add(category)

    const token = null
    if (req.newToken) token = req.newToken
    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    console.log(err)
    return res.send(Respon.Failed(500, 'Cannot add category, Database Error'))
  }
}

Category.update = async (req, res) => {
  try {
    const id = req.params.id
    const { category } = req.body

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "Invalid id, it must be number and contain no symbol (', <, >)"))
    if (!Verifikasi.input(category, 'string')) return res.send(Respon.Failed(400, "Invalid category, it must be string and contain no symbol (', <, >)"))

    const result = await Model.update(id, category)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Category with id ${id} not found`))
    
    const token = null
    if (req.newToken) token = req.newToken
    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Cannot update category, Database Error'))
  }
}

Category.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return res.send(Respon.Failed(400, "Invalid id, it must be number and contain no symbol (', <, >)"))

    const result = await Model.delete(id)

    if (result.rowCount === 0) return res.send(Respon.Failed(400, `Category with id ${id} not found`))
    
    const token = null
    if (req.newToken) token = req.newToken
    return res.send(Respon.Succes(200, [], token))
  } catch (err) {
    return res.send(Respon.Failed(500, 'Cannot delete category, Database Error'))
  }
}

module.exports = Category
