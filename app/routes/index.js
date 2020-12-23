const config = require('../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion}/`
const userRoutes = require('./userRoutes')

module.exports = (app) => {
  app.use(`${routePrefix}/user`, userRoutes)
}
