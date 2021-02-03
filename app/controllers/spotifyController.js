const util = require('../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const config = require('../config/index')
const schema = require('../middleware/schemaValidator/spotifySchema')
const UserState = require('../models/userState')
// const UserRating = require('../models/userRating')

class SpotifyController {
  async saveSpotifyState (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.saveState.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      validationResult.user_id = req.decoded.id
      const param = { user_id: req.decoded.id, isSpotifyConnected: validationResult.connect }
      const data = await commonService.createOrUpdate(UserState, param)
      delete data[0].user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data[0])
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = SpotifyController
