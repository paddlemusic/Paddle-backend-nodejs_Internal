const University = require('../../../models/university')
class ProfileService {
  getUniversities () {
    return new Promise((resolve, reject) => {
      University.findAll({
        // limit: pagination.limit,
        // offset: pagination.offset,
        attributes: ['id', 'name', 'city', 'created_at', 'updated_at'],
        raw: true
        // result.likes=likes
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = ProfileService
