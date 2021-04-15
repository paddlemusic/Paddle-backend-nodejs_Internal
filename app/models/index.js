const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(config.DB.database, config.DB.user, config.DB.password,
  {
    host: config.DB.host,
    dialect: 'postgres',
    port: 5432
  })
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})
//sequelize.sync({ alter: true })
/*  .then(function (instance) {
    return instance.updateAttributes({ syncedAt: sequelize.fn('NOW') })
  }) */

module.exports = sequelize
