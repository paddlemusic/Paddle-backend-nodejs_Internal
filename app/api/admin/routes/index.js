const config = require('../../../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion2}`
const userRoutes = require('./userRoutes')
const universityRoutes = require('./universityRoutes')

module.exports = (app) => {
  app.use(`${routePrefix}/admin`, userRoutes)
  app.use(`${routePrefix}/university`, universityRoutes)
}
