const Bcrypt = require('../Helper/Hash')
const MyDB = require('../Config/Database')
const user = {}

user.addUser = (username, password, rule) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO "user"(username, password, rule) VALUES ('${username}', '${password}', '${rule}')`
    MyDB.query(sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

user.getByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT password, rule FROM "user" WHERE username='${username}'`
    MyDB.query(sql)
      .then(res => {
        resolve(res.rows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

user.setToken = async (token, user) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE "user" SET token='${token}' WHERE username='${user}'`
    MyDB.query(sql)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

user.getToken = async (user) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT rule,token FROM "user" WHERE username='${user}'`
    MyDB.query(sql)
      .then(res => resolve(res.rows))
      .catch(err => reject(err))
  })
}

module.exports = user