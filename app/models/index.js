const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(config.DB.database, config.DB.user, config.DB.password,
  {
    host: config.DB.host,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    }
  })

// sequelize.sync()
// .then(function (instance) {
//   return instance.updateAttributes({ syncedAt: sequelize.fn('NOW') })
// })

module.exports = sequelize
