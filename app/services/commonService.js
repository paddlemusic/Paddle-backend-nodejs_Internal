class CommonService {
  create (table, params) {
    return new Promise((resolve, reject) => {
      table.create(params)
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  update (table, params, condition) {
    return new Promise((resolve, reject) => {
      table.update(params, { where: condition, returning: false })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  findOne (table, condition, attributes) {
    return new Promise((resolve, reject) => {
      table.findOne({ where: condition, attributes: attributes })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  findAll (table, condition, attributes) {
    return new Promise((resolve, reject) => {
      table.findAll({ where: condition, attributes: attributes })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  delete (table, condition) {
    return new Promise((resolve, reject) => {
      table.destroy({ where: condition })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = CommonService
