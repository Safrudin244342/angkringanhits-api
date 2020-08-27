const Model = require('../Model/Product')
const Respon = require('../Config/Respon')
const Product = {}

Product.all = async (req, res) => {
    try{
        const data = await Model.getAll()
        return res.send(Respon.Succes(200, data))
    }catch (error){
        return res.send(Respon.Failed(500, "cannoct get data from database"))
    }
}

Product.add = async (req, res) => {
    try{
        let {name, price, stock, imgLocation} = req.body

        if (typeof(name) != "string") return res.send(Respon.Failed(400, "name must be string"))
        if (typeof(imgLocation) != "string") return res.send(Respon.Failed(400, "imgLocation must be string"))
        if (isNaN(parseInt(price))) return res.send(Respon.Failed(400, "price must be number"))
        if (isNaN(parseInt(stock))) return res.send(Respon.Failed(400, "stock must be number"))

        const result = await Model.add(name, price, stock, imgLocation)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        return res.send(Respon.Failed(500, "cannot add data to database"))
    }
}

module.exports = Product