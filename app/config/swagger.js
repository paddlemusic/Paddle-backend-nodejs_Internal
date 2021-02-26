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
    host: `${process.env.HOST}:${process.env.PORT}`,
    basePath: '/paddle/api/v1',
    tags: [{
      name: 'User',
      description: 'User onboarding, search, etc.'
      // externalDocs: {
      //   description: 'Find out more',
      //   url: 'http://swagger.io'
      // }
    },
    {
      name: 'Profile',
      description: 'User profile'
      // externalDocs: {
      //   description: 'Find out more',
      //   url: 'http://swagger.io'
      // }
    },
    {
      name: 'Chart',
      description: 'Trending tracks artists and albums'
      // externalDocs: {
      //   description: 'Find out more',
      //   url: 'http://swagger.io'
      // }
    },
    {
      name: 'Home',
      description: 'Home posts, shares, likes etc.'
      // externalDocs: {
      //   description: 'Find out more',
      //   url: 'http://swagger.io'
      // }
    },
    {
      name: 'User Media',
      description: 'Playlists, top songs/artists, saved songs/artists etc.'
      // externalDocs: {
      //   description: 'Find out more',
      //   url: 'http://swagger.io'
      // }
    },
    {
      name: 'admin',
      description: 'Everything about admin & user management',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io'
      }
    },
    {
      name: 'admin-university',
      description: 'Everything about universities management',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io'
      }
    },
    {
      name: 'admin-analytics',
      description: 'Everything about universities management',
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
  apis: ['./app/api/user/routes/*.js', './app/api/admin/routes/*.js']
}
/* const options2 = {
  swaggerDefinition: {
    info: {
      title: 'Paddle',
      version: '1.0.0',
      description: 'All v2 routes documentation',
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
          url: 'http://localhost:8080/paddle/api/v2',
          description: 'Local server'
        }
      ]
    },
    host: `${process.env.HOST}:${process.env.PORT}`,
    basePath: '/paddle/api/v2',
    tags: [{
      name: 'User',
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
  apis: ['./app/api/admin/routes/*.js']

} */
const swaggerSpecification = swaggerJsdoc(options)
// const swaggerSpecification2 = swaggerJsdoc(options2)
module.exports = {
  swaggerSpecification
  // swaggerSpecification2
}
