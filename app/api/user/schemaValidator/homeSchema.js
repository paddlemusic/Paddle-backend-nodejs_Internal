const Joi = require('@hapi/joi')

const schema = {
  userPost: Joi.object().keys({
    media_id: Joi.string().required(),
    playURI: Joi.string(),
    artist_id: Joi.string().trim().allow('').allow(null), // added artist_id
    album_id: Joi.string().trim().allow('').allow(null), // added album_id
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    meta_data2: Joi.string().allow('').allow(null),
    shared_with: Joi.array().items(Joi.number().min(1).allow(null)),
    album_name: Joi.string().allow('').allow(null),
  }),
  likeUnlikePost: Joi.object().keys({
    post_id: Joi.number().required(),
    playURI: Joi.string(),
    type: Joi.string().required()
  }),
  userShare: Joi.object().keys({
    media_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    shared_with: Joi.number().allow(null)
  })
}

module.exports = schema
