const CommonService = require('../services/commonService')
// const UserService = require('../services/userService')
const AnalyticsService = require('../services/analyticsService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
// const lodash = require('lodash')
const moment = require('moment')
// const UniversityTrending = require('../../../models/universityTrending')
// const UserPost = require('../../../models/userPost')
// const StreamStats = require('../../../models/streamStats')
const User = require('../../../models/user')
const UserStats = require('../../../models/userStats')
// const AnalyticsSchema = require('../schemaValidator/analyticsSchema')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
// const { number } = require('@hapi/joi')

const commonService = new CommonService()
// const userService = new UserService()
const analyticsService = new AnalyticsService()

class AnalyticsController {
  // optimized code for analytics
  async getStreamStats(req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.query.time_span) === 1) {
        // Get All stream stats
        req.query.university_id = Number(req.query.university_id) >= 1 ? req.query.university_id : null
        const totalCount = await analyticsService.getStreamStatsTotalCount(req.query)
        console.log('totalCount', totalCount)
        const allStreamStats = await analyticsService.getStreamStats(req.query, pagination)
        console.log('allStreamStats', allStreamStats)
        const data = {
          count: totalCount,
          mediaData: allStreamStats
        }
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        /* if (Number(req.query.university_id) >= 1) {
          const totalCount = await analyticsService.getStreamStatsUniversityWiseCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseStreamStats(req.query, pagination)
          // const allStreamStats = await analyticsService.getStreamStats(req.query, pagination)
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
        } */
      } else {
        // Get Streams on monthly basis
        req.query.university_id = Number(req.query.university_id) >= 1 ? req.query.university_id : null
        const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

        const daysInMonth = moment(startDate).daysInMonth()
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

        const totalCount = await analyticsService.getStreamStatsMonthlyCount(req.query, startDate, endDate)
        console.log('totalCount', totalCount)
        const allStreamStats = await analyticsService.getMonthlyStreamStats(req.query, startDate, endDate, pagination)
        console.log('allStreamStats', allStreamStats)
        const data = {
          count: totalCount,
          mediaData: allStreamStats
        }
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        /* if (Number(req.query.university_id) >= 1) {
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
        } */
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSharesLikes(req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      /* const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      } */
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      
      // yearly basis
      if (Number(req.query.time_span) === 1) {
        // for particular university
        if (Number(req.query.university_id) >= 1) {
          const totalCount = await analyticsService.getUserPostUniversityWiseCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseUserPost(req.query, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = {
            count: totalCount,
            mediaData: allStreamStats[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } 
        // for none
        else if(Number(req.query.university_id) < 0) {
          const totalCount = await analyticsService.getUserPostWithoutUniversityCount(req.query)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getWithoutUniversityUserPost(req.query, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = {
            count: totalCount,
            mediaData: allStreamStats[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else { // for all university
          const totalCount = await analyticsService.getUserPostTotalCount(req.query)
          //console.log('totalCount', totalCount)
          const allUserPost = await analyticsService.getUserPost(req.query, pagination)
          //console.log('allStreamStats', allUserPost)
          const data = {
            count: totalCount,
            mediaData: allUserPost[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get Shares/likes on monthly basis
        // for particular university
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

          const totalCount = await analyticsService.getUniversityUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getUniversityWiseMonthlyUserPost(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = {
            count: totalCount.length ? totalCount[0].count : 0,
            mediaData: allStreamStats[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        // for none
        else if(Number(req.query.university_id) < 0) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

          const totalCount = await analyticsService.getWithoutUniversityUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getWithoutUniversityMonthlyUserPost(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = {
            count: totalCount.length ? totalCount[0].count : 0,
            mediaData: allStreamStats[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } 
        // for all university
        else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')

          const totalCount = await analyticsService.getUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)
          const allStreamStats = await analyticsService.getMonthlyUserPost(req.query, startDate, endDate, pagination)
          console.log('allStreamStats', allStreamStats)
          const data = {
            count: totalCount,
            mediaData: allStreamStats[0]
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getSignups(req, res) {
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
          const streamCount = await commonService.findAndCountAll(User, {
            university_code: req.query.university_id,
            role: config.constants.ROLE.USER
          })
          console.log('unviersity wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else if(Number(req.query.university_id) === -1) {
          const streamCount = await commonService.findAndCountAll(User, {
            university_code: null,
            role: config.constants.ROLE.USER
          })
          //console.log('unviersity wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } 
        else {
          const streamCount = await commonService.findAndCountAll(User, {
            role: config.constants.ROLE.USER
          })
          console.log('Whole wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get Signup on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
          const streamCount = await commonService.findAndCountAll(User, {
            university_code: req.query.university_id,
            created_at: {
              [Op.between]: [startDate, endDate]
            },
            role: config.constants.ROLE.USER
          })
          console.log('unviersity wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } 
        else if(Number(req.query.university_id) === -1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
          const streamCount = await commonService.findAndCountAll(User, {
            university_code: null,
            created_at: {
              [Op.between]: [startDate, endDate]
            },
            role: config.constants.ROLE.USER
          })
          console.log('unviersity wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

          const streamCount = await commonService.findAndCountAll(User, {
            created_at: {
              [Op.between]: [startDate, endDate]
            },
            role: config.constants.ROLE.USER
          })
          console.log('Whole wise', streamCount.count)
          const data = {
            signupCount: streamCount.count
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAppUsageTime(req, res) {
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
          const appUsageTime = await commonService.findAll(UserStats, {
            university_id: req.query.university_id
          }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('University wise', appUsageTime[0].sum)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageTime[0].sum)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          //const data = { appUsageTime: appUsageTime[0].sum }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else if(Number(req.query.university_id) === -1) {
          const appUsageTime = await commonService.findAll(UserStats, {
            university_id: null
          }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('University wise', appUsageTime[0].sum)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageTime[0].sum)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          //const data = { appUsageTime: appUsageTime[0].sum }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
         else {
          const appUsageCount = await analyticsService.getTotalAppUsage()
          console.log('Whole wise', appUsageCount)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageCount[0].appUsageTime)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          //const data = { appUsageTime: appUsageCount[0].appUsageTime }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {
        // Get All app usage on monthly basis
        if (Number(req.query.university_id) >= 1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')
          const appUsageTime = await commonService.findAll(UserStats, {
            university_id: req.query.university_id,
            date: {
              [Op.between]: [startDate, endDate]
            }
          }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('Whole wise', appUsageTime[0].sum)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageTime[0].sum)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          // const data = { appUsageTime: appUsageTime[0].sum }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } 
        else if(Number(req.query.university_id) === -1) {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')
          const appUsageTime = await commonService.findAll(UserStats, {
            university_id: null,
            date: {
              [Op.between]: [startDate, endDate]
            }
          }, [Sequelize.fn('sum', Sequelize.col('app_usage_time'))])
          console.log('Whole wise', appUsageTime[0].sum)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageTime[0].sum)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          // const data = { appUsageTime: appUsageTime[0].sum }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD')
          const appUsageCount = await analyticsService.getMonthlyTotalAppUsage(startDate, endDate)
          console.log('Whole wise', appUsageCount)
          // seconds to HH:MM:SS
          const measuredTime = new Date(null);
          measuredTime.setSeconds(Number(appUsageCount[0].appUsageTime)) // specify value of SECONDS
          const MHSTime = measuredTime.toISOString().substr(11, 8)
          //console.log("time in format",MHSTime)
          //const data = { appUsageTime: appUsageCount[0].appUsageTime }
          const data = {
            appUsageTime: MHSTime
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAppOpenData(req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      req.query.university_id = Number(req.query.university_id) >= 1 ? req.query.university_id : null
      let startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')
      let count = 0
      const daysInMonth = moment(startDate).daysInMonth()
      console.log('days in month', daysInMonth)
      const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')
      console.log('start', startDate)
      console.log('end', endDate)
      const datesInMonth = []
      datesInMonth.push(startDate)
      for (let day = 1; day < daysInMonth; day++) {
        const date = moment(startDate).add(1, 'days').format('YYYY-MM-DD')
        datesInMonth.push(date)
        startDate = date
      }
      const getStats = await analyticsService.getStatsData(req.query.university_id, datesInMonth, req.query.open_time, pagination)
      console.log('all over', getStats)
      const countsData = getStats.map(post => {
        return post.count
      })
      console.log(countsData)
      countsData.forEach(element => {
        if (Number(element) === daysInMonth) {
          count = count + 1
        }
      })
      const data = {
        appUsageCount: count
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
      /* if (Number(req.query.university_id) >= 1) {
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        let startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')
        let count = 0
        const daysInMonth = moment(startDate).daysInMonth()
        console.log('days in month', daysInMonth)
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')
        console.log('start', startDate)
        console.log('end', endDate)
        const datesInMonth = []
        datesInMonth.push(startDate)
        for (let day = 1; day < daysInMonth; day++) {
          const date = moment(startDate).add(1, 'days').format('YYYY-MM-DD')
          datesInMonth.push(date)
          startDate = date
        }

        // const getStats = await commonService.findAndCountAll(UserStats, { university_id: req.query.university_id, app_open_count: { [Op.gte]: 2 }, date: datesInMonth }, [[Sequelize.fn('count', Sequelize.col('user_id')), 'count'], 'user_id'])
        const getStats = await analyticsService.getStatsDataUniversityWise(req.query.university_id, datesInMonth, req.query.open_time, pagination)
        console.log('via university', getStats)
        const countsData = getStats.map(post => { return post.count })
        console.log(countsData)
        countsData.forEach(element => {
          if (Number(element) === daysInMonth) {
            count = count + 1
          }
        })
        const data = { appUsageCount: count }
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
      } else {
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        let startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')
        let count = 0
        const daysInMonth = moment(startDate).daysInMonth()
        console.log('days in month', daysInMonth)
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')
        console.log('start', startDate)
        console.log('end', endDate)
        const datesInMonth = []
        datesInMonth.push(startDate)
        for (let day = 1; day < daysInMonth; day++) {
          const date = moment(startDate).add(1, 'days').format('YYYY-MM-DD')
          datesInMonth.push(date)
          startDate = date
        }

        // const getStats = await commonService.findAndCountAll(UserStats, { university_id: req.query.university_id, app_open_count: { [Op.gte]: 2 }, date: datesInMonth }, [[Sequelize.fn('count', Sequelize.col('user_id')), 'count'], 'user_id'])
        const getStats = await analyticsService.getStatsData(datesInMonth, req.query.open_time, pagination)
        console.log('all over', getStats)
        const countsData = getStats.map(post => { return post.count })
        console.log(countsData)
        countsData.forEach(element => {
          if (Number(element) === daysInMonth) {
            count = count + 1
          }
        })
        const data = { appUsageCount: count }
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
      } */
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getWeeklyAppOpenData(req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD')
      const daysInMonth = moment(startDate).daysInMonth()
      const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD ')

      const getWeeks = await analyticsService.getWeeks(startDate, endDate, req.query.university_id)
      const weekDayStartingDate = getWeeks[1].rows.map(post => {
        return moment(post.weekdate).format('YYYY-MM-DD')
      })

      const weekCount = weekDayStartingDate.length

      const weeklyUsersData = await analyticsService.getAppOpenDataWeekly(startDate, endDate, req.query.university_id)

      const weeklyUsersCount = {}
      let usersCount = 0
      weeklyUsersData[0].forEach(weekData => {
        weeklyUsersCount[[weekData.user_id]] = weeklyUsersCount[[weekData.user_id]] ?
          (weeklyUsersCount[[weekData.user_id]] + 1) :
          (1)
        if (Number(weeklyUsersCount[[weekData.user_id]]) === Number(weekCount)) {
          usersCount++
        }
      })
      console.log(weeklyUsersCount)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {
        usersCount: usersCount
      })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  // 
  async getAppPostData(req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      if (Number(req.query.time_span) === 1) {  // last 1 year
        // Get All signup count
        if (Number(req.query.university_id) >= 1) {
          const totalCount = await analyticsService.getUserPostUniversityWiseCount(req.query)
          console.log('totalCount', totalCount)
          const data = {
            count: totalCount
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
        else if(Number(req.query.university_id) === -1) {
          const totalCount = await analyticsService.getUserPostWithoutUniversityCount(req.query)
          console.log('totalCount', totalCount)
          const data = {
            count: totalCount
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
         else {
          const totalCount = await analyticsService.getUserPostTotalCount(req.query)
          console.log('totalCount', totalCount)
          const data = {
            count: totalCount
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else if ((Number(req.query.time_span) === 2)) {   // last 1 month
       
        if (Number(req.query.university_id) >= 1 || Number(req.query.university_id) === -1) {
          Number(req.query.university_id) === -1 ? req.query.university_id = null : req.query.university_id
          console.log('university id - - - ',req.query.university_id)
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss ')

          const totalCount = await analyticsService.getUniversityUserPostMonthlyCount(req.query, startDate, endDate)
          console.log('totalCount', totalCount)

          const countMoreThanTwoPost = await analyticsService.getUniversityUserCountMoreThanTwoPost(req.query, startDate, endDate)

         // find the users which are repeated
         let repeatArr = []
         for (let i = 0; i < countMoreThanTwoPost.rows.length; i++) {
           for(let j=i+1; j<countMoreThanTwoPost.rows.length; j++) {
             if(countMoreThanTwoPost.rows[i].user_id == countMoreThanTwoPost.rows[j].user_id) {
               repeatArr.push(countMoreThanTwoPost.rows[i].user_id)
             }
           }
         }
         repeatArr = [...new Set(repeatArr)]

          const data = {
            count: totalCount.length ? totalCount[0].count : 0, countMoreThanTwoPost: repeatArr.length
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          const startDate = moment([req.query.year, req.query.month - 1, 1]).format('YYYY-MM-DD hh:mm:ss')

          const daysInMonth = moment(startDate).daysInMonth()
          const endDate = moment(startDate).add(daysInMonth - 1, 'days').format('YYYY-MM-DD hh:mm:ss')

          console.log('startDate - - -', startDate, endDate)

          const totalCount = await analyticsService.getUserPostMonthlyCount(req.query, startDate, endDate)          

          const countMoreThanTwoPost = await analyticsService.getUserCountMoreThanTwoPost(req.query, startDate, endDate)
          console.log('count more than two - - ', countMoreThanTwoPost.rows[0])

          let repeatArr = []
          for (let i = 0; i < countMoreThanTwoPost.rows.length; i++) {
            for(let j=i+1; j<countMoreThanTwoPost.rows.length; j++) {
              if(countMoreThanTwoPost.rows[i].user_id == countMoreThanTwoPost.rows[j].user_id) {
                repeatArr.push(countMoreThanTwoPost.rows[i].user_id)
              }
            }
          }
          repeatArr = [...new Set(repeatArr)]

          const data = {
            count: totalCount, countMoreThanTwoPost: repeatArr.length
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      } else {    // last 1 week
        if (Number(req.query.university_id) >= 1 || Number(req.query.university_id) === -1 ){
          Number(req.query.university_id) === -1 ? req.query.university_id = null : req.query.university_id
          
          const startDate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD')

          const endDate = moment(Date.now()).format('YYYY-MM-DD')

          let countMoreThanTwoPost = await analyticsService.getUniversityUserCountMoreThanTwoPost(req.query, startDate, endDate)

         // find the users which are repeated
         let repeatArr = []
         for (let i = 0; i < countMoreThanTwoPost.rows.length; i++) {
           for(let j=i+1; j<countMoreThanTwoPost.rows.length; j++) {
             if(countMoreThanTwoPost.rows[i].user_id == countMoreThanTwoPost.rows[j].user_id) {
               repeatArr.push(countMoreThanTwoPost.rows[i].user_id)
             }
           }
         }
         repeatArr = [...new Set(repeatArr)]
         
         const data = {
          countMoreThanTwoPost: repeatArr.length
         }

          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        } else {
          
          const startDate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD')

          const endDate = moment(Date.now()).format('YYYY-MM-DD')

          let countMoreThanTwoPost = await analyticsService.getUserCountMoreThanTwoPost(req.query, startDate, endDate)
        
          // find the users which are repeated
          let repeatArr = []
          for (let i = 0; i < countMoreThanTwoPost.rows.length; i++) {
            for(let j=i+1; j<countMoreThanTwoPost.rows.length; j++) {
              if(countMoreThanTwoPost.rows[i].user_id == countMoreThanTwoPost.rows[j].user_id) {
                repeatArr.push(countMoreThanTwoPost.rows[i].user_id)
              }
            }
          }
          repeatArr = [...new Set(repeatArr)]
          //console.log('repeatArr - -', repeatArr)
          
          const data = {
            countMoreThanTwoPost: repeatArr.length
          }
          util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
        }
      }
    } catch (error) {
      console.log(error)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = AnalyticsController