const StreamStats = require('../../../models/streamStats')
const UserPost = require('../../../models/userPost')
const User = require('../../../models/user')
const UserStats = require('../../../models/userStats')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class AnalyticsService {
  // total stream services

  async getStreamStats (params, pagination) {
    const result = await StreamStats.findAll({
      where: {
        media_type: params.media_type
        // university_id: params.university_id
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
  }

  async getUniversityWiseStreamStats (params, pagination) {
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
  }

  async getStreamStatsTotalCount (params) {
    const result = await StreamStats.count({
      where: {
        media_type: params.media_type
      },
      distinct: true,
      col: 'media_id'
    })
    // console.log(result)
    return result
  }

  async getStreamStatsUniversityWiseCount (params) {
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
  }

  // monthly stream services

  async getStreamStatsMonthlyCount (params, startDate, endDate) {
    const result = await StreamStats.count({
      where: {
        date: {
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

  async getUniversityWiseStreamStatsMonthlyCount (params, startDate, endDate) {
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
  }

  async getUniversityWiseMonthlyStreamStats (params, startDate, endDate, pagination) {
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
  }

  async getMonthlyStreamStats (params, startDate, endDate, pagination) {
    const result = await StreamStats.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        },
        media_type: params.media_type
        // university_id: params.university_id
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
    // console.log(result)
    return result
  }

  async getUserPost (params, pagination) {
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
      offset: pagination.offset
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

    // console.log(result)
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
        'caption'
      ],
      group: ['media_id', 'media_type', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'caption'],
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
}

module.exports = AnalyticsService
