const Joi = require('@hapi/joi')

const schema = {
  track: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  }),
  artist: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  }),

  // media_type: Joi.number(),
  deleteMedia: Joi.object().keys({
    media_id: Joi.array().items(Joi.string()).unique()
  }),
  media_id: Joi.string().required(),
  userMedia: Joi.object().keys({
    data: Joi.array().items(Joi.object().keys({
      media_id: Joi.string().required(),
      media_image: Joi.string().allow('').allow(null),
      media_name: Joi.string().allow('').allow(null),
      meta_data: Joi.string().allow('').allow(null)
    }))
  })

}
module.exports = schema
