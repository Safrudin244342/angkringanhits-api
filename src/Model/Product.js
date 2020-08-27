const MyDB = require('../Config/Database')
const MyDb = require('../Config/Database')
const Product = {}

Product.getAll = () => {
    return new Promise((resolve, reject) => {
        MyDB.query("SELECT * FROM product ORDER BY id DESC")
            .then(res => {
                resolve(res.rows)
            })
            .catch(err => {
                reject(err)
            })
    })
}

Product.add = (name, price, stock, imgLocation) => {
    return new Promise((resolve, reject) => {
        MyDB.query(`INSERT INTO product(name, price, stock, "imgLocation") VALUES ('${name}', ${parseInt(price)}, ${parseInt(stock)}, '${imgLocation}')`)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

module.exports = Product