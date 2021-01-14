const util = require('../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const config = require('../config/index')
const schema = require('../middleware/schemaValidator/userSchema')
const UserPost = require('../models/userPost')

class HomePageController {
  async createUserPost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userPost.validate(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const params = {
        user_id: req.decoded.id,
        track_id: req.body.track_id,
        caption: req.body.caption,
        shared_with: req.body.shared_with
      }
      await commonService.create(UserPost, params)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUserPost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userPost.validate(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = HomePageController
