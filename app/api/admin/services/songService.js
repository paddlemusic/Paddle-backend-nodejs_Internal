const StreamStats = require('../../../models/streamStats')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
class ProfileService {
  getSongs (name, pagination) {
    return new Promise((resolve, reject) => {
      StreamStats.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        limit: pagination.limit,
        offset: pagination.offset,
        attributes: ['id', 'name', 'city', 'created_at', 'updated_at'],
        order: [['id', 'ASC']],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = ProfileService
