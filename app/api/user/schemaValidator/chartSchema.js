const Joi = require('@hapi/joi')

const schema = {
  addMedia: Joi.object().keys({
    track: Joi.object().keys({
      media_id: Joi.string().trim().required(),
      playURI: Joi.string().trim().default(null).allow('').allow(null),
      artist_id: Joi.string().trim().allow('').allow(null), // added artist_id
      album_id: Joi.string().trim().allow('').allow(null), // added album_id
      media_type: Joi.number().default(1),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim().allow('').allow(null),
        artist_name: Joi.string().trim().allow('').allow(null),
        album_name: Joi.string().trim().allow('').allow(null),
        track_type: Joi.string().trim().allow(null).allow(''),
        image: Joi.string().trim().allow('').allow(null)
      })
    }),
    artist: Joi.object().keys({
      media_id: Joi.string().trim().required(),
      media_type: Joi.number().default(2),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim().allow('').allow(null),
        image: Joi.string().trim().allow('').allow(null)
      })
    }),
    album: Joi.object().keys({
      media_id: Joi.string().trim().required(),
      media_type: Joi.number().default(3),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim().allow('').allow(null),
        image: Joi.string().trim().allow('').allow(null)
      }),
      album_type: Joi.string().trim()
    }).allow(null).allow('').optional()
  })
}
module.exports = schema
