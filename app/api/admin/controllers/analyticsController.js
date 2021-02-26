const CommonService = require('../services/commonService')
const UserService = require('../services/userService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
// const UniversityTrending = require('../../../models/universityTrending')
const UserPost = require('../../../models/userPost')
const User = require('../../../models/user')
const AnalyticsSchema = require('../schemaValidator/analyticsSchema')
const Sequelize = require('sequelize')
// const { number } = require('@hapi/joi')

const commonService = new CommonService()
const userService = new UserService()

class AnalyticsController {
  async getsharesTotally (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        streamCount = await userService.getSharesPerUniversity(req.query.media_id, req.query.university_id, req.query.media_type)
        console.log('unviersity wise', streamCount.count)
      } else {
        streamCount = await commonService.findAndCountAll(UserPost, { media_id: req.query.media_id, media_type: req.query.media_type })
        console.log('Whole wise', streamCount.count)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount.count)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getLikesTotally (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        streamCount = await userService.getLikesPerUniversity(req.query.media_id, req.query.university_id, req.query.media_type)
        console.log('unviersity wise', streamCount)
      } else {
        streamCount = await commonService.findAll(UserPost, { media_id: req.query.media_id, media_type: req.query.media_type }, [Sequelize.fn('sum', Sequelize.col('like_count'))])
        console.log('Whole wise', streamCount)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAppSignups (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getSignups.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_code >= 1) {
        streamCount = await commonService.findAndCountAll(User, { university_code: req.query.university_code })
        console.log('unviersity wise', streamCount.count)
      } else {
        streamCount = await commonService.findAndCountAll(User)
        console.log('Whole wise', streamCount.count)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount.count)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSharesMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount

    // console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        streamCount = await userService.getUniversityMonthlyShares(req.query.media_id, req.query.university_id)
        console.log('unviersity wise', streamCount)
      } else {
        console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwww', req.query)
        streamCount = await userService.getTotalMonthlyShares(req.query.media_id, req.query.media_type, req.query.month)
        console.log('Whole wise', streamCount)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = AnalyticsController
