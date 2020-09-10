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

History.report = (start, end, action) => {
  return new Promise((resolve, reject) => {
    MyDB.query(`SELECT ${action}(amount) FROM history WHERE date BETWEEN NOW() - INTERVAL '${end}' AND NOW() - INTERVAL '${start}'`)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

History.getFor = (state) => {
  return new Promise((resolve, reject) => {
    const time = state === 'today' ? '1 DAYS': state === 'week' ? '1 WEEKS':'1 MONTHS'

    MyDB.query(`SELECT * FROM history WHERE date BETWEEN NOW() - INTERVAL '${time}' AND NOW() ORDER BY id DESC`)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

History.allReport = (start, end) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT daily.count::DECIMAL as orders, daily.sum::DECIMAL as amount, fixMis.date FROM ( SELECT date::date FROM generate_series(NOW() - INTERVAL '${ start }', NOW() - INTERVAL '${ end }', '-1d') as date ) fixMis LEFT JOIN ( SELECT count(id), sum(amount), date FROM history WHERE date BETWEEN NOW() - INTERVAL '${ end }' AND NOW() - INTERVAL '${ start }' GROUP BY date ) daily USING (date)`
    
    MyDB.query(sql)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

module.exports = History
