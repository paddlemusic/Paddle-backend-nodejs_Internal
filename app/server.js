const express = require('express')
const config = require('../app/config')
const loader = require('./loaders/loader')
const path = require('path');

async function startServer () {
  const app = express()
  app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
console.log("path is:", path.join(__dirname, '/public'))
app.use(express.static(path.join(__dirname, '/public')));

  loader(app)
  app.listen(config.port, () => {
    console.log(config.DB)
    console.log('Response Success, server running at ' + config.port)
  })
}

startServer()
