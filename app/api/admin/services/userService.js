const User = require('../../../models/user')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class UserService {
  login (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['id', 'name', 'username', 'email', 'phone_number',
        'password', 'is_privacy', 'is_verified', 'is_active', 'createdAt', 'updatedAt']
      const criteria = {
        role: 2,
        email: (params.email).toLowerCase()
      }
      User.findOne({ where: criteria, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUsers (name) {
    return new Promise((resolve, reject) => {
      User.findAll({
        // limit: pagination.limit,
        // offset: pagination.offset,
        where: {
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        //        order: [
        //         ['created_at', 'DESC']
        //       ],
        attributes: ['id', 'name', 'profile_picture'],
        raw: true
        // result.likes=likes
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = UserService
