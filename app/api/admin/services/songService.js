// const StreamStats = require('../../../models/streamStats')
// const StreamStats = require('../../../models/streamStats')
// const Sequelize = require('sequelize')
// const University = require('../../../models/university')
// const Op = Sequelize.Op
class ProfileService {
  /* getSongs (name, pagination) {
    return new Promise((resolve, reject) => {
      StreamStats.findAndCountAll({
        where: {
          media_metadata: {
            name: {
              [Op.iLike]: '%' + name + '%'
            }
          },
          media_type: 1
        },
        limit: pagination.limit,
        offset: pagination.offset,
        attributes: [Sequelize.literal('"StreamStats"."id","StreamStats"."university_id","StreamStats"."media_metadata","StreamStats"."date"')],
        // attributes: ['university_id', 'media_metadata', 'date'],
        order: [['university_id', 'ASC']],
        raw: true,
        include: [{
          model: University,
          required: true,
          where: {
            // role: 1,
            name: {
              [Op.iLike]: '%' + name + '%'
            }
          },
          attributes: ['id', 'name']
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  fetchChart (universityId, mediaType, pagination) {
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
}
module.exports = ProfileService
