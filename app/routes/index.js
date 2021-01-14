const config = require('../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion}`
const userRoutes = require('./userRoutes')
const homeRoutes = require('./homeRoutes')
module.exports = (app) => {
  app.use(`${routePrefix}/user`, userRoutes)
  app.use(`${routePrefix}/home`, homeRoutes)
}
