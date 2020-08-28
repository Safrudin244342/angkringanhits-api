const MyDB = require('../Config/Database')
const History = {}

History.getAll = () => {
  return new Promise((resolve, reject) => {
    MyDB.query('SELECT * FROM history ORDER BY date DESC')
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

History.add = (cashier, orders, amount) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`INSERT INTO history(cashier, orders, amount) VALUES('${cashier}', '${orders}', ${amount})`)
      .then(success => {
        resolve(success)
      })
      .catch(err => {
        resolve(err)
      })
  })
}

module.exports = History
