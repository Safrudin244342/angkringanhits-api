const Pool = require('pg-pool')

const MyDb = new Pool({
  user: 'beningpostgresdb',
  database: 'angkringanhits',
  password: 'Karyaanakdesa632',
  host: 'localhost'
})

module.exports = MyDb
