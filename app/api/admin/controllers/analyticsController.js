const CommonService = require('../services/commonService')
const UserService = require('../services/userService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
const moment = require('moment')
// const UniversityTrending = require('../../../models/universityTrending')
const UserPost = require('../../../models/userPost')
const StreamStats = require('../../../models/streamStats')
const User = require('../../../models/user')
const AnalyticsSchema = require('../schemaValidator/analyticsSchema')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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

  async getSharesMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        streamCount = await userService.getUniversityMonthlyShares(req.query.media_id, req.query.university_id, req.query.media_type, startDate, endDate)
        console.log('unviersity wise', streamCount.count)
      } else {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        streamCount = await userService.getTotalMonthlyShares(req.query.media_id, req.query.media_type, startDate, endDate)
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

  async getLikesMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        streamCount = await userService.getUniversityMonthlyLikes(req.query.media_id, req.query.university_id, req.query.media_type, startDate, endDate)
        console.log('unviersity wise', streamCount)
      } else {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        streamCount = await userService.getTotalMonthlyLikes(req.query.media_id, req.query.media_type, startDate, endDate)
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

  async getAppSignupsMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getSignupsMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_code >= 1) {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
        streamCount = await commonService.findAndCountAll(User, { university_code: req.query.university_code, created_at: { [Op.between]: [startDate, endDate] } })
        // streamCount = await userService.getUniversityMonthlySignups(req.query.university_code, startDate, endDate)
        console.log('unviersity wise', streamCount.count)
      } else {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
        streamCount = await commonService.findAndCountAll(User, { created_at: { [Op.between]: [startDate, endDate] } })
        // streamCount = await userService.getTotalMonthlySignups(startDate, endDate)
        console.log('Whole wise', streamCount.count)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount.count)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getstreamsTotally (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    // console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, university_id: req.query.university_id, media_type: req.query.media_type }, [Sequelize.fn('sum', Sequelize.col('count'))])
        console.log('unviersity wise', streamCount)
      } else {
        streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, media_type: req.query.media_type }, [Sequelize.fn('sum', Sequelize.col('count'))])
        console.log('Whole wise', streamCount)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamCount)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getStreamsMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let streamCount
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')

        streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, university_id: req.query.university_id, media_type: req.query.media_type, date: { [Op.between]: [startDate, endDate] } }, [Sequelize.fn('sum', Sequelize.col('count'))])
        console.log('unviersity wise', streamCount)
      } else {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

        streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, media_type: req.query.media_type, date: { [Op.between]: [startDate, endDate] } }, [Sequelize.fn('sum', Sequelize.col('count'))])
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
