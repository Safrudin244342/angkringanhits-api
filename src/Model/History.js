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
    MyDB.query(`INSERT INTO history(cashier, orders, amount) VALUES('${cashier}', '${orders}', ${parseInt(amount)})`)
      .then(success => {
        resolve(success)
      })
      .catch(err => {
        resolve(err)
      })
  })
}

History.delete = (id) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`DELETE FROM history WHERE id=${id}`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

History.update = (id, cashier, orders, amount) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`UPDATE history SET cashier='${cashier}', orders='${orders}', amount=${parseInt(amount)} WHERE id=${id}`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = History
