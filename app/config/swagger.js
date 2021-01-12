const swaggerJsdoc = require('swagger-jsdoc')
const options = {
  swaggerDefinition: {
    info: {
      title: 'Paddle',
      version: '1.0.0',
      description: 'All v1 routes documentation',
      license: {
        name: '',
        url: ''
      },
      contact: {
        name: '',
        url: '',
        email: ''
      },
      servers: [
        {
          url: 'http://localhost:8080/paddle/api/v1',
          description: 'Local server'
        }
      ]
    },
    host: `http://${process.env.HOST}:${process.env.PORT}`,
    basePath: '/paddle/api/v1',
    tags: [{
      name: 'user',
      description: 'Everything about user',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io'
      }
    }],
    schemes: [
      'http',
      'https'
    ],
    consumes: [
      'application/json'
    ],
    produces: [
      'application/json'
    ]
  },

  // List of files to be processes. You can also set globs './routes/*.js'
  // apis: ['./app/routes*.js'],
  apis: ['./app/routes/*.js']
}
const swaggerSpecification = swaggerJsdoc(options)
module.exports = {
  swaggerSpecification
}
