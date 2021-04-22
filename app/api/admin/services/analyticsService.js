const StreamStats = require('../../../models/streamStats')
const UserPost = require('../../../models/userPost')
const User = require('../../../models/user')
const UserStats = require('../../../models/userStats')
const Sequelize = require('sequelize')
const sequelize = require('../../../models')
const Op = Sequelize.Op

class AnalyticsService {
  // total stream services

  async getStreamStats (params, pagination) {
    const where = {
      media_type: params.media_type
    }

    if (!(params.university_id === null)) {
      where.university_id = params.university_id
    }
    console.log('where condition', where)
    const result = await StreamStats.findAll({
      where: where,

      // where: {
      //  media_type: params.media_type
      // university_id: params.university_id
      // },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('count')), 'streamCount'],
        'media_id',
        // 'media_type',
        'media_metadata'
      ],
      group: ['media_id', 'media_type', 'media_metadata'],
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  }

  /* async getUniversityWiseStreamStats (params, pagination) { // to be removed
    const result = await StreamStats.findAll({
      where: {
        media_type: params.media_type,
        university_id: params.university_id
      },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('count')), 'streamCount'],
        'media_id',
        // 'media_type',
        'media_metadata'
      ],
      group: ['media_id', 'media_type', 'media_metadata'],
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  } */

  async getStreamStatsTotalCount (params) {
    const where = {
      media_type: params.media_type
    }

    if (!(params.university_id === null)) {
      where.university_id = params.university_id
    }
    console.log('where condition', where)
    const result = await StreamStats.count({
      where: where,
      // where: {
      //  media_type: params.media_type
      // },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  }

  /* async getStreamStatsUniversityWiseCount (params) { // to be removed
    const result = await StreamStats.count({
      where: {
        media_type: params.media_type,
        university_id: params.university_id
      },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  } */

  // monthly stream services

  async getStreamStatsMonthlyCount (params, startDate, endDate) {
    const where = {
      date: {
        [Op.between]: [startDate, endDate]
      },
      media_type: params.media_type
    }

    if (!(params.university_id === null)) {
      where.university_id = params.university_id
    }
    console.log('where condition', where)
    const result = await StreamStats.count({
      where: where,
      // where: {
      // date: {
      //   [Op.between]: [startDate, endDate]
      //  },
      // media_type: params.media_type
      // },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  }

  /* async getUniversityWiseStreamStatsMonthlyCount (params, startDate, endDate) { // to be removed
    const result = await StreamStats.count({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type,
        university_id: params.university_id
      },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  } */

  /* async getUniversityWiseMonthlyStreamStats (params, startDate, endDate, pagination) { // to be removed
    const result = await StreamStats.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type,
        university_id: params.university_id
      },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('count')), 'streamCount'],
        'media_id',
        // 'media_type',
        'media_metadata'
      ],
      group: ['media_id', 'media_type', 'media_metadata'],
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  } */

  async getMonthlyStreamStats (params, startDate, endDate, pagination) {
    const where = {
      date: {
        [Op.between]: [startDate, endDate]
      },
      media_type: params.media_type
    }

    if (!(params.university_id === null)) {
      where.university_id = params.university_id
    }
    console.log('where condition', where)
    const result = await StreamStats.findAll({
      where: where,
      // where: {
      //   date: {
      //     [Op.between]: [startDate, endDate]
      //   },
      //   media_type: params.media_type
      // university_id: params.university_id
      //  },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('count')), 'streamCount'],
        'media_id',
        // 'media_type',
        'media_metadata'
      ],
      group: ['media_id', 'media_type', 'media_metadata'],
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  }

  // total share like services

  async getUserPostTotalCount (params) {
    const result = await UserPost.count({
      where: {
        media_type: params.media_type
      },
      distinct: true,
      col: 'media_id'
    })
    return result
  }

  async getUserPost (params, pagination) {
    const result = await UserPost.findAndCountAll({
      where: {
        media_type: params.media_type
        // university_id: params.university_id
      },

      attributes: [
        [Sequelize.fn('count', Sequelize.col('media_type')), 'shareCount'],
        [Sequelize.fn('sum', Sequelize.col('like_count')), 'likeCount'],
        'media_id',
        'media_image',
        'media_name',
        'meta_data',
        'meta_data2',
        'caption',
        'album_name'
      ],

      group: ['media_id', 'media_type', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'caption', 'album_name'],
      limit: pagination.limit,
      offset: pagination.offset,
      raw: true
    })
    // console.log(result)
    return result
  }

  async getUserPostUniversityWiseCount (params) {
    const result = await UserPost.count({
      where: {
        media_type: params.media_type
        // university_id: params.university_id
      },
      distinct: true,
      col: 'media_id',
      include: [{
        model: User,
        required: true,
        where: { university_code: params.university_id },
        attributes: []
        // as: 'post'
      }]
    })
    return result
  }

  async getUniversityWiseUserPost (params, pagination) {
    const result = await UserPost.findAll({
      where: {
        media_type: params.media_type
        // university_id: params.university_id
      },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('media_type')), 'shareCount'],
        [Sequelize.fn('sum', Sequelize.col('like_count')), 'likeCount'],
        'media_id',
        'media_image',
        'media_name',
        'meta_data',
        'meta_data2',
        'caption'
      ],
      group: ['media_id', 'media_type', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'caption'],
      limit: pagination.limit,
      offset: pagination.offset,
      include: [{
        model: User,
        required: true,
        where: { university_code: params.university_id },
        attributes: []
        // as: 'post'
      }]
    })
    // console.log(result)
    return result
  }

  // monthly stream services

  async getUserPostMonthlyCount (params, startDate, endDate) {
    const result = await UserPost.count({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
      },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  }

  async getUniversityUserPostMonthlyCount (params, startDate, endDate) {
    const result = await UserPost.count({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
        // university_id: params.university_id
      },
      distinct: true,
      col: 'media_id',
      attributes: ['user_id'],
      include: [{
        model: User,
        required: true,
        where: { university_code: params.university_id },
        attributes: []
        // as: 'post'
      }]
    })
    // console.log(result)
    return result
  }

  async getUniversityWiseMonthlyUserPost (params, startDate, endDate, pagination) {
    const result = await UserPost.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
        // university_id: params.university_id
      },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('media_type')), 'shareCount'],
        [Sequelize.fn('sum', Sequelize.col('like_count')), 'likeCount'],
        'media_id',
        'media_image',
        'media_name',
        'meta_data',
        'meta_data2',
        'caption'
      ],
      group: ['media_id', 'media_type', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'caption'],
      limit: pagination.limit,
      offset: pagination.offset,
      include: [{
        model: User,
        required: true,
        where: { university_code: params.university_id },
        attributes: []
        // as: 'post'
      }]
    })
    // console.log(result)
    return result
  }

  async getMonthlyUserPost (params, startDate, endDate, pagination) {
    const result = await UserPost.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
        // university_id: params.university_id
      },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('media_type')), 'shareCount'],
        [Sequelize.fn('sum', Sequelize.col('like_count')), 'likeCount'],
        'media_id',
        'media_image',
        'media_name',
        'meta_data',
        'meta_data2',
        'caption',
        'album_name'
      ],
      group: ['media_id', 'media_type', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'caption', 'album_name'],
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  }

  getTotalAppUsage () {
    // console.log('ffffffffffff')
    return new Promise((resolve, reject) => {
      UserStats.findAll({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('app_usage_time')), 'appUsageTime']
        ],
        raw: true

      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getMonthlyTotalAppUsage (startDate, endDate) {
    // console.log('ffffffffffff')
    return new Promise((resolve, reject) => {
      UserStats.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('app_usage_time')), 'appUsageTime']
        ],
        raw: true

      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  /* async getStatsDataUniversityWise (universityId, datesInMonth, openTime, pagination) { // to be removed
    const result = await UserStats.findAll({
      where: {
        date: datesInMonth,
        university_id: universityId,
        app_open_count: {
          [Op.gte]: openTime
        }
      },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('user_id')), 'count'],
        'user_id'
      ],
      group: ['user_id'],
      raw: true,
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  } */

  async getStatsData (universityId, datesInMonth, openTime, pagination) {
    const where = {
      date: datesInMonth,
      app_open_count: {
        [Op.gte]: openTime
      }
    }

    if (!(universityId === null)) {
      where.university_id = universityId
    }
    console.log('where condition', where)
    const result = await UserStats.findAll({
      where: where,
      // where: {
      //  date: datesInMonth,
      //  app_open_count: {
      //    [Op.gte]: openTime
      //  }
      // },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('user_id')), 'count'],
        'user_id'
      ],
      group: ['user_id'],
      raw: true,
      limit: pagination.limit,
      offset: pagination.offset
    })
    // console.log(result)
    return result
  }

  async getWeeks (startDate, endDate, universityId = null) {
    let subQuery = ''
    if (universityId) {
      subQuery = ` AND university_id = ${universityId} `
    }
    const rawQuery =
             `SELECT
             date_trunc('week', "date"::date) as weekdate
           from
             "User_Stats"
           where
             date >= '${startDate}'
             and date <= '${endDate}'
             ${subQuery}
           group by
             1
           order by
             1`
    // console.log(rawQuery)
    const data = await sequelize.query(rawQuery, {
      // bind: [params.user_id, params.university_id, params.date, params.app_usage_time, 1]
    })
    // console.log('marjaneya', data)
    return data
  }

  async getAppOpenDataWeekly (startDate, endDate, universityId = null) {
    let subQuery = ''
    if (universityId) {
      subQuery = ` AND university_id = ${universityId} `
    }
    const rawQuery =
             `SELECT
                distinct(user_id),
                date_trunc('week', "date"::date) as weekdate
              FROM "User_Stats"
              WHERE
                date >= '${startDate}' AND
                date <= '${endDate}' 
                ${subQuery}
              GROUP BY
                weekdate, user_id`
    const data = await sequelize.query(rawQuery, {
    })
    return data
  }

  async getWeekslyStatsData (startDate, endDate) {
    const result = await UserStats.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        },
        app_open_count: {
          [Op.gte]: 1
        }
      },
      attributes: [
        [Sequelize.fn('count', Sequelize.col('user_id')), 'count'],
        'user_id'
      ],
      group: ['user_id'],
      raw: true
      // limit: pagination.limit,
      // offset: pagination.offset
    })
    // console.log('from service', result)
    return result
  }

  async getUserCountMoreThanTwoPost (params, startDate, endDate) {
    const result = await UserPost.findAndCountAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
      },
      attributes: ['user_id'],
      raw: true
      // distinct: true,
      // col: 'media_id'
    })
    console.log(result)
    return result
  }

  async getUniversityUserCountMoreThanTwoPost (params, startDate, endDate) {
    const result = await UserPost.findAndCountAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
        // university_id: params.university_id
      },
      // distinct: true,
      // col: 'media_id',
      attributes: ['user_id'],
      include: [{
        model: User,
        required: true,
        where: { university_code: params.university_id },
        attributes: []
        // as: 'post'
      }]
    })
    // console.log(result)
    return result
  }
}

module.exports = AnalyticsService
