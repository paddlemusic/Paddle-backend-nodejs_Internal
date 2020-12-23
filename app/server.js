const express = require('express')
const config = require('../app/config')
const loader = require('./loaders/loader')

async function startServer () {
  const app = express()
  loader(app)
  app.listen(config.port, () => {
    console.log(config.DB)
    console.log('Response Success, server running at ' + config.port)
  })
}

startServer()
