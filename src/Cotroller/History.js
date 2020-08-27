const Respon = require('../Config/Respon')
const Model = require('../Model/History')
const History = {}

History.all = async (req, res) => {
    try{
        let data = await Model.getAll()
        data.map(value => {
            newDate = String(value.date).split(' ')
            newDate = `${newDate[2]} ${newDate[1]} ${newDate[3]}`
            value.date = newDate
        })

        return res.send(Respon.Succes(200, data))
    }catch (err){
        return res.send(Respon.Failed(500, "Databse Error"))
    }
}

History.add = async (req, res) => {
    try{
        let {cashier, orders, amount} = req.body

        if (typeof(cashier) != 'string') return res.send(Respon.Failed(400, "cashier must be string"))
        if (typeof(orders) != 'string') return res.send(Respon.Failed(400, "orders must be string"))
        if (isNaN(parseInt(amount))) return res.send(Respon.Failed(400, "amount must be integer"))

        await Model.add(cashier, orders, amount)
        return res.send(Respon.Succes(200, []))
    }catch (err){
        return res.send(Respon.Failed(500, "Database Error"))
    }
}

module.exports = History