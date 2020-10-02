const Pool = require('pg-pool')

const MyDb = new Pool({
  user: (process.env.POSTGRE_USER || 'root'),
  database: (process.env.POSTGRE_DB || 'postgres'),
  password: (process.env.POSTGRE_PASSWORD || ''),
  host: (process.env.POSTGRE_HOST || 'localhost'),
  port: (process.env.POSTGRE_PORT || 5432)
})

module.exports = MyDb
