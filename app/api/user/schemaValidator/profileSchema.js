const Joi = require('@hapi/joi')

const schema = {

  // saveArtist: Joi.object().keys({
  //   artist_id: Joi.string().required(),
  //   artist_name: Joi.string().required(),
  //   image_id: Joi.string()
  // }),

  // userShare: Joi.object().keys({
  //   media_id: Joi.string().required(),
  //   caption: Joi.string().allow(null).allow(''),
  //   media_image: Joi.string().allow('').allow(null),
  //   media_name: Joi.string().allow('').allow(null),
  //   meta_data: Joi.string().allow('').allow(null),
  //   shared_with: Joi.number().allow(null).required()
  // }),
  // friend: Joi.object().keys({
  //   shared_with: Joi.number().min(1).required()
  // }),

  // tracks: Joi.object().keys({
  //   tracksData: Joi.array().items(Joi.object().keys({
  //     media_id: Joi.string().required(),
  //     media_image: Joi.string().allow('').allow(null),
  //     media_name: Joi.string().allow('').allow(null),
  //     meta_data: Joi.string().allow('').allow(null),
  //     meta_data2: Joi.string().allow('').allow(null)
  //   }))
  // }),
  // deleteTrack: Joi.object().keys({
  //   track_ids: Joi.array().items(Joi.string()).unique()
  // }),
  userPrivacy: Joi.object().keys({
    is_privacy: Joi.boolean().required()
  }),
  editDetails: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(30).required(),
    phone_number: Joi.string().trim().max(17).min(10).required(),
    date_of_birth: Joi.string().trim(),
    biography: Joi.string().trim().max(300).allow(null).allow(''),
    university_code: Joi.number().min(1).allow(null)
  })
}

module.exports = schema
