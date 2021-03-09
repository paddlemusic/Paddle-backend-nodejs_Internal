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
    // let trackAndCount
    const streamData = {}

    // let streamCount = []
    // let mediaIds
    // let streamCount2
    // console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        // streamCount = await commonService.findAll(StreamStats, { university_id: req.query.university_id, media_type: req.query.media_type }, [[Sequelize.fn('sum', Sequelize.col('count'))], 'media_metadata', 'date'])
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const trackAndCountUniversityWise = await userService.getTrackAndCountUniversityWise(req.query.media_type, req.query.university_id)
        const mediaIds = trackAndCountUniversityWise.map(post => { return post.media_id })
        // const trackDetailsAndCountUniversityWise = await commonService.findAll(StreamStats, { media_id: mediaIds }, ['media_id', 'media_metadata'])
        const trackDetailsAndCountUniversityWise = await userService.getTrackDetailsAndCountUniversityWise(mediaIds, pagination)
        // console.log('check error', trackDetailsAndCountUniversityWise)
        const result = []
        const map = new Map()
        for (const item of trackDetailsAndCountUniversityWise) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_metadata: item.media_metadata
            })
          }
        }
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, trackAndCountUniversityWise[i]))
        streamData.count = result.length
        console.log('unviersity wise', streamData)
      } else {
        // const streamCount2 = await commonService.findAll(StreamStats, { media_type: req.query.media_type }, [[Sequelize.fn('sum', Sequelize.col('count')), 'streamCount']])
        // streamCount = await commonService.findAll(StreamStats, { media_type: req.query.media_type }, ['media_metadata', [Sequelize.fn('sum', Sequelize.col('count')), 'streamCount'], 'date'])
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const trackAndCount = await userService.getTrackAndCount(req.query.media_type)
        console.log('trackAndCount', trackAndCount)
        const mediaIds = trackAndCount.map(post => { return post.media_id })
        // console.log('mediaIds', mediaIds)
        // const trackDetailsAndCount = await commonService.findAll(StreamStats, { media_id: mediaIds }, ['media_id', 'media_metadata'])
        const trackDetailsAndCount = await userService.getTrackDetailsAndCount(mediaIds, pagination)
        console.log('check here', trackDetailsAndCount)
        // const trackDetailsAndCount = await userService.getTrackDetailsAndCount(mediaIds)
        // console.log('trackDetailsAndCount', trackDetailsAndCount)
        // const unique = [...new Set(trackDetailsAndCount.map(item => item.media_metadata))]
        // console.log('aaaaaa', unique)
        const result = []
        const map = new Map()
        for (const item of trackDetailsAndCount) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_metadata: item.media_metadata
            })
          }
        }
        // result.count = trackDetailsAndCount.count
        console.log('check here alsso', result)
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, trackAndCount[i]))
        streamData.count = result.length
        console.log('WholeWise', streamData)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getStreamsMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    // let streamCount
    const streamData = {}
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')

        // streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, university_id: req.query.university_id, media_type: req.query.media_type, date: { [Op.between]: [startDate, endDate] } }, [Sequelize.fn('sum', Sequelize.col('count'))])
        const monthlyTrackAndCountUniversityWise = await userService.getMonthlyTrackAndCountUniversityWise(req.query.media_type, req.query.university_id, startDate, endDate)
        const mediaIds = monthlyTrackAndCountUniversityWise.map(post => { return post.media_id })
        // const monthlyTrackDetailsAndCountUniversityWise = await commonService.findAll(StreamStats, { media_id: mediaIds }, ['media_id', 'media_metadata'])
        const monthlyTrackDetailsAndCountUniversityWise = await userService.getMonthlyTrackDetailsAndCountUniversityWise(mediaIds, pagination)
        const result = []
        const map = new Map()
        for (const item of monthlyTrackDetailsAndCountUniversityWise) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_metadata: item.media_metadata
            })
          }
        }
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, monthlyTrackAndCountUniversityWise[i]))
        streamData.count = result.length
        console.log('unviersity wise', streamData)
      } else {
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

        // streamCount = await commonService.findAll(StreamStats, { media_id: req.query.media_id, media_type: req.query.media_type, date: { [Op.between]: [startDate, endDate] } }, [Sequelize.fn('sum', Sequelize.col('count'))])
        const monthlyTrackAndCount = await userService.getMonthlyTrackAndCount(req.query.media_type, startDate, endDate)
        const mediaIds = monthlyTrackAndCount.map(post => { return post.media_id })
        // const monthlyTrackDetailsAndCount = await commonService.findAll(StreamStats, { media_id: mediaIds }, ['media_id', 'media_metadata'])
        const monthlyTrackDetailsAndCount = await userService.getMonthlyTrackDetailsAndCount(mediaIds, pagination)
        const result = []
        const map = new Map()
        for (const item of monthlyTrackDetailsAndCount) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_metadata: item.media_metadata
            })
          }
        }
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, monthlyTrackAndCount[i]))
        streamData.count = result.length
        console.log('Whole wise', streamData)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = AnalyticsController
