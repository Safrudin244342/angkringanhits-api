const Model = require('../Model/Category')
const Respon = require('../Config/Respon')
const Category = {}

Category.all = async (req, res) => {
    try{
        let data = await Model.all()

        return res.send(Respon.Succes(200, data))
    }catch (err){
        return res.send(Respon.Failed(500, "Database Error"))
    }
}

Category.add = async (req, res) => {
    try{
        let {category} = req.body

        if (typeof(category) != 'string' || category.length == 0) return res.send(Respon.Failed(400, "category must be string"))

        await Model.add(category)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        console.log(err)
        return res.send(Respon.Failed(500, "Database Error"))
    }
}

module.exports = Category