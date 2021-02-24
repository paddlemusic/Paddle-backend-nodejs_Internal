const Joi = require('@hapi/joi')

const schema = {

  saveArtist: Joi.object().keys({
    artist_id: Joi.string().required(),
    artist_name: Joi.string().required(),
    image_id: Joi.string()
  }),

  userShare: Joi.object().keys({
    media_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    shared_with: Joi.number().allow(null).required()
  }),
  friend: Joi.object().keys({
    shared_with: Joi.number().min(1).required()
  }),
  playlist: Joi.object().keys({
    name: Joi.string().max(50).trim().allow(null).allow(''),
    description: Joi.string().max(200).trim().allow(null).allow(''),
    image: Joi.string().trim().allow(null).allow('')
  }),
  deletePlaylist: Joi.object().keys({
    playlist_id: Joi.number().min(1).required()
  }),
  tracks: Joi.object().keys({
    tracksData: Joi.array().items(Joi.object().keys({
      media_id: Joi.string().required(),
      media_image: Joi.string().allow('').allow(null),
      media_name: Joi.string().allow('').allow(null),
      meta_data: Joi.string().allow('').allow(null),
      meta_data2: Joi.string().allow('').allow(null)
    }))
  }),
  deleteTrack: Joi.object().keys({
    track_ids: Joi.array().items(Joi.string()).unique()
  }),
  userPrivacy: Joi.object().keys({
    is_privacy: Joi.boolean().required()
  }),
  rateApp: Joi.object().keys({
    rating: Joi.number().min(0).max(5).required(),
    feedback: Joi.string().max(300).trim()
  }),
  topMediaCount: Joi.object().keys({
    media_type: Joi.number().min(1).max(2).required(), // /^(1|2)/
    count: Joi.number().min(0).max(10).required() // /^(0|3|5|10)/
  })
}

module.exports = schema
