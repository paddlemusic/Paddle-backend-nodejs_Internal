const config = require('../../../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion2}`
const userRoutes = require('./userRoutes')

module.exports = (app) => {
  app.use(`${routePrefix}/admin`, userRoutes)
}
