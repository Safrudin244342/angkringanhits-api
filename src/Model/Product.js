const MyDB = require('../Config/Database')
const Product = {}

Product.getAll = () => {
  return new Promise((resolve, reject) => {
    MyDB.query('SELECT * FROM product ORDER BY id DESC')
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.search = (name) => {
  return new Promise((resolve, reject) => {
    let sql = []

    for (const sub of name) {
      sql.push(`name LIKE '%${sub}%'`)
    }

    sql = sql.join(' OR ')

    MyDB.query(`SELECT * FROM product WHERE ${sql}`)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.add = (name, price, stock, imgLocation, category) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`INSERT INTO product(name, price, stock, "imgLocation", category) VALUES ('${name}', ${parseInt(price)}, ${parseInt(stock)}, '${imgLocation}', '${category}')`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.update = (id, name, price, stock, imgLocation, category) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`UPDATE product SET name='${name}', price=${parseInt(price)}, stock=${parseInt(stock)}, "imgLocation"='${imgLocation}', category='${category}' WHERE id=${id}`)
      .then(succes => {
        resolve(succes)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.delete = (id) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`DELETE FROM product WHERE id=${id}`)
      .then(success => {
        resolve(success)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.sort = (sortBy, action) => {
  return new Promise((resolve, reject) => {
    action = (action === 'up') ? 'DESC' : 'ASC'
    sortBy = (sortBy === 'date') ? 'id' : sortBy
    MyDB.query(`SELECT * FROM product ORDER BY ${sortBy} ${action}`)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Product.getImage = (id) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`SELECT "imgLocation" FROM product WHERE id=${id}`)
      .then(res => {
        try {
          resolve(res.rows[0].imgLocation)
        } catch (err) {
          reject(err)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = Product
