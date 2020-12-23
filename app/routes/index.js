const config = require('../config')
const routePrefix = `/paddle/api/v${config.constants.apiVersion}/`

module.exports = (app) => {
    // app.use(`${routePrefix}/user`, userRoute)
    console.log('inside route module')
}