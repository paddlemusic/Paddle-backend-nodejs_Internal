const Joi = require('@hapi/joi')

const schema = {
  addMedia: Joi.object().keys({
    track: Joi.object().keys({
      media_id: Joi.string().required(),
      media_type: Joi.number().min(1).max(2).required(),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    }),
    artist: Joi.object().keys({
      media_id: Joi.string().required(),
      media_type: Joi.number().min(1).max(2).required(),
      media_metadata: Joi.object().keys({
        name: Joi.string().trim(),
        image: Joi.string().trim()
      })
    })
  })
}
module.exports = schema
