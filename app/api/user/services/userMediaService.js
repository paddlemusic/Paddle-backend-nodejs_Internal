const UserMedia = require('../../../models/userMedia')

class UserMediaService {
  // If no service required, delete this class.
  getUserMedia (condition, pagination) {
    return new Promise((resolve, reject) => {
      const attributes = ['media_id', 'media_name', 'media_image', 'meta_data',
        'meta_data2', 'media_type', 'created_at', 'updated_at', 'play_uri', 'order', 'album_id', 'artist_id'] // added album_id,artist_id in  get track/artist response

      UserMedia.findAndCountAll({
        where: condition,
        attributes: attributes,
        limit: pagination ? pagination.limit : null,
        offset: pagination ? pagination.offset : null,
        order: [['order', 'ASC'],
          ['created_at', 'DESC']]
      })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = UserMediaService
