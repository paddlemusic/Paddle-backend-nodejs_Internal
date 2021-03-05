// const StreamStats = require('../../../models/streamStats')
const UniversityTrending = require('../../../models/universityTrending')
const Sequelize = require('sequelize')
const University = require('../../../models/university')
const Op = Sequelize.Op
class ProfileService {
  getSongs (name, pagination) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findAndCountAll({
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
        attributes: [Sequelize.literal('"UniversityTrending"."university_id","UniversityTrending"."media_metadata","UniversityTrending"."created_at"')],
        // attributes: ['university_id', 'media_metadata', 'created_at'],
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
}
module.exports = ProfileService
