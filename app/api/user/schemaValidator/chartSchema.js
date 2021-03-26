const Joi = require('@hapi/joi')

const schema = {
  addMedia: Joi.object().keys({
    track: Joi.object().keys({
      media_id: Joi.string().required(),
      playURI: Joi.string().default(null),
      artist_id: Joi.string().trim().allow('').allow(null), // added artist_id
      album_id: Joi.string().trim().allow('').allow(null), // added album_id
      media_type: Joi.number().default(1),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        artist_name: Joi.string().trim(),
        album_name: Joi.string().trim(),
        track_type: Joi.string().trim().allow(null).allow(''),
        image: Joi.string().trim()
      })
    }),
    artist: Joi.object().keys({
      media_id: Joi.string().required(),
      //playURI: Joi.string(),
      media_type: Joi.number().default(2),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    }),
    album: Joi.object().keys({
      media_id: Joi.string().required(),
      //playURI: Joi.string(),
      media_type: Joi.number().default(3),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    })
  })
}
module.exports = schema
