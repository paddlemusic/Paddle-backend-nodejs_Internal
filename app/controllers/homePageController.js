const util = require('../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const config = require('../config/index')
const schema = require('../middleware/schemaValidator/userSchema')
const UserPost = require('../models/userPost')
const UserService = require('../services/userService')
const userService = new UserService()

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
      console.log('params are:', params)
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
      const validationResult = await schema.follow.validate(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }

      const myfollowingData = await userService.getUserFollowing(req.decoded)
      const myfollowersIDs = myfollowingData.map(data => { return data.follower_id })
      const postData = await userService.getUserPublicPost(myfollowersIDs, null)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, postData)
      console.log('MyFollower:', postData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = HomePageController
