const Joi = require('@hapi/joi')

const schema = {
  addMedia: Joi.object().keys({
    track: Joi.object().keys({
      media_id: Joi.string().required(),
      playURI: Joi.string(),
      media_type: Joi.number().equal(1).default(1).required(),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        artist_name: Joi.string().trim(),
        track_type: Joi.string().trim().allow(null).allow(''),
        image: Joi.string().trim()
      })
    }),
    artist: Joi.object().keys({
      media_id: Joi.string().required(),
      playURI: Joi.string(),
      media_type: Joi.number().equal(2).default(2),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    }),
    album: Joi.object().keys({
      media_id: Joi.string().required(),
      playURI: Joi.string(),
      media_type: Joi.number().equal(3).default(3),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    })
  })
}
module.exports = schema
