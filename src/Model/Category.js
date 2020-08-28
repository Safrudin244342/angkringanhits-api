const MyDB = require('../Config/Database')
const Category = {}

Category.all = () => {
  return new Promise((resolve, reject) => {
    MyDB.query('SELECT * FROM category')
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Category.add = (category) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`INSERT INTO category(category) VALUES ('${category}')`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Category.update = (id, category) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`UPDATE category SET category='${category}' WHERE id=${id}`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

Category.delete = (id) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`DELETE FROM category WHERE id=${id}`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = Category
