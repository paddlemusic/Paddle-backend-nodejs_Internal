const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(config.DB.database, config.DB.user, config.DB.password,
  {
    host: config.DB.host,
    dialect: 'postgres',
    port: 5432
  })

<<<<<<< HEAD
//sequelize.sync()
=======
// sequelize.sync({alter: true})
>>>>>>> 108a00838d3e06c04acb55e0126239ad43d7353b

module.exports = sequelize
