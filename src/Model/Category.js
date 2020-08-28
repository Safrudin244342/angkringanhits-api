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

module.exports = Category
