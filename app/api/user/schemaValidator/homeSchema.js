const Joi = require('@hapi/joi')

const schema = {
  userPost: Joi.object().keys({
    media_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    meta_data2: Joi.string().allow('').allow(null),
    shared_with: Joi.number().allow(null)
  }),
  likeUnlikePost: Joi.object().keys({
    post_id: Joi.number().required(),
    type: Joi.string().required()
  })
}

module.exports = schema
