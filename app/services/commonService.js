const User = require('../models/user')

class CommonService {
  create (table, params) {
    return new Promise((resolve, reject) => {
      User.create(params)
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  update (table, params, condition) {
    return new Promise((resolve, reject) => {
      User.update(params, { where: condition, returning: false })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  findOne (table, condition, attributes) {
    return new Promise((resolve, reject) => {
      User.findOne({ where: condition, raw: true, attributes: attributes })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = CommonService
