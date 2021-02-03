const UniversityTrending = require('../models/universityTrending')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

class ChartService {
  async addMedia (params) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findOne({
        where: {
          university_id: params.university_id,
          media_id: params.media_id,
          media_type: params.media_type
        }
      }).then(findResult => {
        if (findResult) {
          findResult.increment('count')
        } else {
          UniversityTrending.create(params)
            .then((university) => { university.increment('count') })
        }
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  async addArtist (params) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findOne({
        where: {
          university_id: params.university_id,
          media_id: params.media_id,
          media_type: params.media_type
        }
      }).then(findResult => {
        if (findResult) {
          findResult.increment('count')
        } else {
          UniversityTrending.create(params)
            .then((university) => { university.increment('count') })
        }
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  fetchChart (universityId, mediaType, pagination) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findAndCountAll({
        where: {
          university_id: universityId,
          media_type: mediaType,
          updated_at: {
            [Op.gte]: moment().utc().subtract(30, 'days').format('YYYY-MM-DD')
          }
        },
        attributes: ['media_id', 'media_type', 'media_metadata'],
        limit: pagination.limit,
        offset: pagination.offset,
        order: [['count', 'DESC']]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  fetchArtistsChart (universityId, pagination) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findAndCountAll({
        where: {
          university_id: universityId,
          updated_at: {
            [Op.gte]: moment().utc().subtract(30, 'days').format('YYYY-MM-DD')
          }
        },
        limit: pagination.limit,
        offset: pagination.offset
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = ChartService
