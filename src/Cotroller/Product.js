const Model = require('../Model/Product')
const Respon = require('../Config/Respon')
const Product = {}

Product.all = async (req, res) => {
    try{
        const data = await Model.getAll()
        return res.send(Respon.Succes(200, data))
    }catch (error){
        return res.send(Respon.Failed(500, "cannot get data from database"))
    }
}

Product.add = async (req, res) => {
    try{
        let {name, price, stock, imgLocation, category} = req.body

        if (typeof(name) != "string") return res.send(Respon.Failed(400, "name must be string"))
        if (typeof(imgLocation) != "string") return res.send(Respon.Failed(400, "imgLocation must be string"))
        if (isNaN(parseInt(price))) return res.send(Respon.Failed(400, "price must be number"))
        if (isNaN(parseInt(stock))) return res.send(Respon.Failed(400, "stock must be number"))
        if (typeof(category) != "string") return res.send(Respon.Failed(400, "category must be string"))

        await Model.add(name, price, stock, imgLocation, category)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        return res.send(Respon.Failed(500, "cannot add data to database, database error"))
    }
}

Product.update = async (req, res) => {
    try{
        let {id, name, price, stock, imgLocation, category} = req.body
        await Model.update(id, name, price, stock, imgLocation, category)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        return res.send(Respon.Failed(500, "cannot update produck, database error"))
    }
}

Product.delete = async (req, res) => {
    try{
        let productId = "ais"
        await Model.delete(id)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        return res.send(Respon.Failed(500, "cannot delate data from database, database error"))
    }
}

module.exports = Product