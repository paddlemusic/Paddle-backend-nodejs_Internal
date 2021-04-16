// const StreamStats = require('../../../models/streamStats')
const StreamStats = require('../../../models/streamStats')
const Sequelize = require('sequelize')
const config = require('../../../config/index')
// const University = require('../../../models/university')
const Op = Sequelize.Op
class ProfileService {
  getSongs (name, universityId, pagination) {
    return new Promise((resolve, reject) => {
      let where = {}
      if (Number(universityId) === 0) {
        where = {
          media_metadata: {
            name: {
              [Op.iLike]: '%' + name + '%'
            }
          },
          media_type: config.constants.MEDIA_TYPE.TRACK
        }
      } else {
        where = {
          media_metadata: {
            name: {
              [Op.iLike]: '%' + name + '%'
            }
          },
          media_type: config.constants.MEDIA_TYPE.TRACK
        }
      }
      StreamStats.findAndCountAll({
        where: where,
        limit: pagination.limit,
        offset: pagination.offset,
        // attributes: [Sequelize.literal('"StreamStats"."id","StreamStats"."university_id","StreamStats"."media_metadata","StreamStats"."date"')],
        attributes: ['university_id', 'media_metadata', 'date'],
        order: [['university_id', 'ASC']],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  /* fetchChart (universityId, mediaType, pagination) {
    return new Promise((resolve, reject) => {
      StreamStats.findAndCountAll({
        where: {
          university_id: universityId,
          media_type: mediaType,
          date: {
            [Op.gte]: moment().utc().subtract(15, 'days').format('YYYY-MM-DD')
          }
        },
        attributes: ['media_id', 'media_type', 'media_metadata'],
        limit: pagination.limit,
        offset: pagination.offset,
        order: [['count', 'DESC']]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  } */

  songsViaUniversity (universityId, pagination) {
    return new Promise((resolve, reject) => {
      StreamStats.findAndCountAll({
        where: {
          university_id: universityId,
          media_type: config.constants.MEDIA_TYPE.TRACK
        },
        limit: pagination.limit,
        offset: pagination.offset,
        // attributes: [Sequelize.literal('"StreamStats"."id","StreamStats"."university_id","StreamStats"."media_metadata","StreamStats"."date"')],
        attributes: ['university_id', 'media_metadata', 'date'],
        order: [['university_id', 'ASC']],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = ProfileService
