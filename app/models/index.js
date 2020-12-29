const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(config.DB.database, config.DB.user, config.DB.password,
  {
    host: config.DB.host,
    dialect: 'postgres',
    port: 5432
  })

// sequelize.sync({alter: true})

module.exports = sequelize
