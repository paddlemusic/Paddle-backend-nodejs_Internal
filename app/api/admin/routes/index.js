const config = require('../../../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion}`
const userRoutes = require('./userRoutes')
const universityRoutes = require('./universityRoutes')
const analyticsRoutes = require('./analyticsRoutes')
const songRoutes = require('./songRoutes')

module.exports = (app) => {
  app.use(`${routePrefix}/admin`, userRoutes)
  app.use(`${routePrefix}/admin/university`, universityRoutes)
  app.use(`${routePrefix}/admin/analytics`, analyticsRoutes)
  app.use(`${routePrefix}/admin/songs`, songRoutes)
}
