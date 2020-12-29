const {Pool} = require('pg')
const config = require('./index')

const pool = new Pool({
  user: config.DB.user,
  host: config.DB.host,
  database: config.DB.database,
  password: config.DB.password,
  port: config.DB.port
})
const connection = { pool }

module.exports = connection
