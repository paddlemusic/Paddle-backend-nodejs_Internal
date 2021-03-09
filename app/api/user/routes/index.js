const config = require('../../../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion}`

const userRoutes = require('./userRoutes')
const homeRoutes = require('./homeRoutes')
const profileRoutes = require('./profileRoutes')
const chartRoutes = require('./chartRoutes')
const spotifyRoutes = require('./spotifyRoutes')
const userMediaRoutes = require('./userMediaRoutes')

module.exports = (app) => {
  app.use(`${routePrefix}/user`, userRoutes)
  app.use(`${routePrefix}/home`, homeRoutes)
  app.use(`${routePrefix}/profile`, profileRoutes)
  app.use(`${routePrefix}/chart`, chartRoutes)
  app.use(`${routePrefix}/spotify`, spotifyRoutes)
  app.use(`${routePrefix}/userMedia`, userMediaRoutes)
}
