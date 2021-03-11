const CommonService = require('../services/commonService')
const UserService = require('../services/userService')
const AnalyticsService = require('../services/analyticsService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
const moment = require('moment')
// const UniversityTrending = require('../../../models/universityTrending')
const UserPost = require('../../../models/userPost')
// const StreamStats = require('../../../models/streamStats')
const User = require('../../../models/user')
const UserStats = require('../../../models/userStats')
const AnalyticsSchema = require('../schemaValidator/analyticsSchema')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
// const { number } = require('@hapi/joi')

const commonService = new CommonService()
const userService = new UserService()
const analyticsService = new AnalyticsService()

class AnalyticsController {
  // ################ TO BE REMOVED lATER ########################
  async getSharesLikesTotally (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    const streamData = {}
    // let streamCount
    console.log(req.query)
    try {
      const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        // streamCount = await userService.getSharesPerUniversity(req.query.media_id, req.query.university_id, req.query.media_type)
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const universityShareTrackAndCount = await userService.getUniversityShareTrackAndCount(req.query.media_type, req.query.university_id)
        console.log('universityShareTrackAndCount', universityShareTrackAndCount)
        const mediaIds = universityShareTrackAndCount.map(post => { return post.media_id })
        console.log('mediaIds', mediaIds)
        const universityShareDetailsAndCount = await userService.getUniversityShareDetailsAndCount(mediaIds, pagination)
        console.log('universityShareDetailsAndCount', universityShareDetailsAndCount)
        const result = []
        const map = new Map()
        for (const item of universityShareDetailsAndCount) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_image: item.media_image,
              media_name: item.media_name,
              meta_data: item.meta_data,
              meta_data2: item.metadata2,
              caption: item.caption,
              shared_with: item.shared_with,
              is_active: item.is_active,
              created_at: item.created_at
            })
          }
        }
        // result.count = trackDetailsAndCount.count
        console.log('result', result)
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, universityShareTrackAndCount[i]))
        streamData.count = result.length
        console.log('unviersity wise', streamData)
      } else {
        // streamCount = await commonService.findAndCountAll(UserPost, { media_id: req.query.media_id, media_type: req.query.media_type })
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const shareTrackAndCount = await userService.getShareTrackAndCount(req.query.media_type)
        const mediaIds = shareTrackAndCount.map(post => { return post.media_id })
        console.log('mediaIds', mediaIds)
        console.log('shareTrackAndCount', shareTrackAndCount)
        const shareDetailsAndCount = await userService.getShareDetailsAndCount(mediaIds, pagination)
        console.log('shareDetailsAndCount', shareDetailsAndCount)
        const result = []
        const map = new Map()
        for (const item of shareDetailsAndCount) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_image: item.media_image,
              media_name: item.media_name,
              meta_data: item.meta_data,
              meta_data2: item.metadata2,
              caption: item.caption,
              shared_with: item.shared_with,
              is_active: item.is_active,
              created_at: item.created_at
            })
          }
        }
        // result.count = trackDetailsAndCount.count
        console.log('result', result)
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, shareTrackAndCount[i]))
        streamData.count = result.length
        console.log('WholeWise', streamData)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSharesLikesMonthly (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    // let streamCount
    const streamData = {}
    try {
      const validationResult = await AnalyticsSchema.getStreamMonthly.validateAsync(req.query)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      } if (req.query.university_id >= 1) {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        // streamCount = await userService.getUniversityMonthlyShares(req.query.media_id, req.query.university_id, req.query.media_type, startDate, endDate)
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const monthlyShareTrackAndCountUniversityWise = await userService.getMonthlyShareTrackAndCountUniversityWise(req.query.media_type, req.query.university_id, startDate, endDate)
        const mediaIds = monthlyShareTrackAndCountUniversityWise.map(post => { return post.media_id })
        console.log('mediaIds', mediaIds)
        const monthlyShareTrackDetailsAndCountUniversityWise = await userService.monthlyShareTrackDetailsAndCountUniversityWise(mediaIds, pagination)
        console.log('check here', monthlyShareTrackDetailsAndCountUniversityWise)
        const result = []
        const map = new Map()
        for (const item of monthlyShareTrackDetailsAndCountUniversityWise) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_image: item.media_image,
              media_name: item.media_name,
              meta_data: item.meta_data,
              meta_data2: item.metadata2,
              caption: item.caption,
              shared_with: item.shared_with,
              is_active: item.is_active,
              created_at: item.created_at
            })
          }
        }
        // result.count = trackDetailsAndCount.count
        console.log('check here alsso', result)
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, monthlyShareTrackAndCountUniversityWise[i]))
        streamData.count = result.length
        console.log('unviersity wise', streamData)
      } else {
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

        // streamCount = await userService.getTotalMonthlyShares(req.query.media_id, req.query.media_type, startDate, endDate)
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const monthlyShareTrackAndCount = await userService.getMonthlyShareTrackAndCount(req.query.media_type, startDate, endDate)
        console.log('monthlyShareTrackAndCount', monthlyShareTrackAndCount)
        const mediaIds = monthlyShareTrackAndCount.map(post => { return post.media_id })
        console.log('mediaIds', mediaIds)
        const monthlyShareDetailsAndCount = await userService.getMonthlyShareDetailsAndCount(mediaIds, pagination)
        console.log('check here', monthlyShareDetailsAndCount)
        const result = []
        const map = new Map()
        for (const item of monthlyShareDetailsAndCount) {
          if (!map.has(item.media_id)) {
            map.set(item.media_id, true)
            result.push({
              media_id: item.media_id,
              media_image: item.media_image,
              media_name: item.media_name,
              meta_data: item.meta_data,
              meta_data2: item.metadata2,
              caption: item.caption,
              shared_with: item.shared_with,
              is_active: item.is_active,
              created_at: item.created_at
            })
          }
        }
        // result.count = trackDetailsAndCount.count
        console.log('check here alsso', result)
        streamData.mediaData = result.map((item, i) => Object.assign({}, item, monthlyShareTrackAndCount[i]))
        streamData.count = result.length
        console.log('Whole wise', streamData)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, streamData)
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

  // ################################## TO BE REMOVED LATER  ###########################################

  // optimized code for analytics
  async getStreamStats (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.query.time_span) === 1) {
        // Get All stream stats
        if (Number(req.query.university_id) >= 1) {
          const totalCount = await analyticsService.getStreamStatsUniversityWiseCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseStreamStats(req.query, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const totalCount = await analyticsService.getStreamStatsTotalCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getStreamStats(req.query, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get Streams on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')

          const totalCount = await analyticsService.getUniversityWiseStreamStatsMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseMonthlyStreamStats(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

          const totalCount = await analyticsService.getStreamStatsMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getMonthlyStreamStats(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSharesLikes (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.query.time_span) === 1) {
        // Get All share/likes
        if (Number(req.query.university_id) >= 1) {
          const totalCount = await analyticsService.getUserPostUniversityWiseCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseUserPost(req.query, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const totalCount = await analyticsService.getUserPostTotalCount(req.query)
          console.log('totalCount', totalCount)
          const allUserPost = await analyticsService.getUserPost(req.query, pagination)
          console.log('allStreamStats', allUserPost)
          const data = { count: totalCount, mediaData: allUserPost }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get Shares/likes on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss ')

          const totalCount = await analyticsService.getUniversityUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseMonthlyUserPost(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

          const totalCount = await analyticsService.getUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getMonthlyUserPost(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = { count: totalCount, mediaData: allStreamStats }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSignups (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      // const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.query.time_span) === 1) {
        // Get All signup count
        if (Number(req.query.university_id) >= 1) {
          const streamCount = await commonService.findAndCountAll(User, { university_code: req.query.university_id })
          console.log('unviersity wise', streamCount.count)
          const data = { signupCount: streamCount.count }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const streamCount = await commonService.findAndCountAll(User)
          console.log('Whole wise', streamCount.count)
          const data = { signupCount: streamCount.count }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get Signup on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
          const streamCount = await commonService.findAndCountAll(User, { university_code: req.query.university_id, created_at: { [Op.between]: [startDate, endDate] } })
          console.log('unviersity wise', streamCount.count)
          const data = { signupCount: streamCount.count }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

          const streamCount = await commonService.findAndCountAll(User, { created_at: { [Op.between]: [startDate, endDate] } })
          console.log('Whole wise', streamCount.count)
          const data = { signupCount: streamCount.count }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAppUsageTime (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      // const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.query.time_span) === 1) {
        // Get All app usage count
        if (Number(req.query.university_id) >= 1) {
          const appUsageTime = await commonService.findAll(UserStats, { university_id: req.query.university_id }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('University wise', appUsageTime[0].sum)
          const data = { appUsageTime: appUsageTime[0].sum }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const appUsageCount = await analyticsService.getTotalAppUsage()
          console.log('Whole wise', appUsageCount)
          const data = { appUsageTime: appUsageCount[0].appUsageTime }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get All app usage on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')
          const appUsageTime = await commonService.findAll(UserStats, { university_id: req.query.university_id, date: { [Op.between]: [startDate, endDate] } }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('Whole wise', appUsageTime[0].sum)
          const data = { appUsageTime: appUsageTime[0].sum }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')
          const appUsageCount = await analyticsService.getMonthlyTotalAppUsage(startDate, endDate)
          console.log('Whole wise', appUsageCount)
          const data = { appUsageTime: appUsageCount[0].appUsageTime }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = AnalyticsController
