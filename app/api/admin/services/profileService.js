const University = require('../../../models/university')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class ProfileService {
  getUniversities (name, pagination) {
    return new Promise((resolve, reject) => {
      University.findAndCountAll({
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

  searchUniversity (name, pagination) {
    return new Promise((resolve, reject) => {
      University.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        limit: pagination.limit,
        offset: pagination.offset,
        attributes: ['id', 'name', 'created_at'],
        // group: ['id'],
        order: [['id', 'ASC']],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = ProfileService
