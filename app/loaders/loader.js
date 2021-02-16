const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../config/swagger.js')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('../routes/index')
const config = require('../config')
const utils = require('../utils/utils')
const constants = require('../config/constants')

function loader (app) {
  app.use(cookieParser())
  app.use(morgan('tiny'))
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
  }))
  app.use(bodyParser.json({
    limit: '50mb'
  }))
  app.use(cors())
  app.use(passport.initialize())
  app.use((req, res, next) => {
    const language = req.params.language || req.headers.language
    if (language) {
      if (config.messages.avail_lang[language]) {
        app.set('lang', language)
        return
      }
    }
    app.set('lang', 'en')
    next()
  })

  app.use('/paddle/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument.swaggerSpecification, {
    explorer: true
  }))
  // app.use('/paddle/admin/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument.swaggerSpecification2, {
  //  explorer: true
  // }))
  app.get('/paddle', (req, res) => {
    res.send('<center><p><b>This is the Paddle app server.</b></p></center>')
  })

  routes(app)
  app.use((req, res, next) => {
    const langMsg = config.messages[req.app.get('lang')]
    utils.failureResponse(res, constants.NOT_FOUND, langMsg.routeNotFound)
    next()
  })
}

module.exports = loader
